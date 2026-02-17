import db from './db.js';

/**
 * @typedef {Object} AuthorizationRequest
 * @property {Object} subject - The user or service making the request (e.g., { id, role, ... })
 * @property {string} action - The action being performed (e.g., 'refund.approve')
 * @property {string} resource - The resource identifier (e.g., 'finance')
 * @property {Object} [context] - Additional context (e.g., { time, amount, ... })
 */

/**
 * @typedef {Object} Decision
 * @property {'ALLOW' | 'DENY'} decision
 * @property {string} [reason]
 * @property {number} [policyId]
 */

/**
 * Evaluates a condition object against the request context.
 * Supported operators: equals, not_equals, greater_than, less_than, contains, source_equals
 */
function evaluateCondition(condition, request) {
    if (!condition) return true; // No condition means always match if patterns match

    const { field, operator, value } = condition;

    // Resolve field value from request (e.g., "subject.role" -> request.subject.role)
    const getFieldValue = (obj, path) => {
        return path.split('.').reduce((o, i) => (o ? o[i] : undefined), obj);
    };

    const actualValue = getFieldValue(request, field);

    switch (operator) {
        case 'equals':
            return actualValue === value;
        case 'not_equals':
            return actualValue !== value;
        case 'greater_than':
            return actualValue > value;
        case 'less_than':
            return actualValue < value;
        case 'contains':
            return Array.isArray(actualValue) ? actualValue.includes(value) : String(actualValue).includes(value);
        case 'source_equals':
            // Special operator: matches if the request value equals the config value
            // useful for string matching like role checks
            return actualValue === value;
        default:
            console.warn(`Unknown operator: ${operator}`);
            return false;
    }
}

/**
 * Main evaluation function
 * @param {AuthorizationRequest} request
 * @returns {Decision}
 */
export function evaluate(request) {
    const { action, resource } = request;

    try {
        // 1. Fetch active policies
        // precise matching or wildcard matching logic would be better in SQL but JS is easier for complex patterns
        // For now, fetch all active and filter in memory for flexibility
        const policies = db.prepare('SELECT * FROM policies WHERE is_active = 1').all();

        let explicitDeny = null;
        let explicitAllow = null;

        for (const policy of policies) {
            // 2. Check Action and Resource Patterns
            // Simple glob-like matching: '*' matches everything. 
            // Exact match otherwise.
            const actionMatch = policy.action_pattern === '*' || policy.action_pattern === action;
            const resourceMatch = policy.resource_pattern === '*' || policy.resource_pattern === resource;

            if (!actionMatch || !resourceMatch) {
                continue;
            }

            // 3. Evaluate Conditions
            let conditionMatch = true;
            if (policy.conditions) {
                try {
                    const conditions = JSON.parse(policy.conditions);
                    // Support single condition object or array of conditions (AND logic)
                    if (Array.isArray(conditions)) {
                        conditionMatch = conditions.every(c => evaluateCondition(c, request));
                    } else {
                        conditionMatch = evaluateCondition(conditions, request);
                    }
                } catch (e) {
                    console.error(`Failed to parse conditions for policy ${policy.id}`, e);
                    conditionMatch = false;
                }
            }

            if (conditionMatch) {
                if (policy.effect === 'DENY') {
                    explicitDeny = policy;
                    break; // Deny trumps all
                } else if (policy.effect === 'ALLOW') {
                    explicitAllow = policy; // Keep looking for a DENY, but remember we found an ALLOW
                }
            }
        }

        // 4. Formulate Decision
        if (explicitDeny) {
            return { decision: 'DENY', reason: `Denied by policy: ${explicitDeny.name}`, policyId: explicitDeny.id };
        }

        if (explicitAllow) {
            return { decision: 'ALLOW', reason: `Allowed by policy: ${explicitAllow.name}`, policyId: explicitAllow.id };
        }

        return { decision: 'DENY', reason: 'Implicit deny: No matching allow policy found' };

    } catch (error) {
        console.error('Evaluation error:', error);
        return { decision: 'DENY', reason: 'Internal error during evaluation' };
    }
}

export function logDecision(request, decisionResult) {
    try {
        const insertLog = db.prepare(`
            INSERT INTO audit_logs (request_payload, decision, reason, policy_id_matched)
            VALUES (?, ?, ?, ?)
        `);

        insertLog.run(
            JSON.stringify(request),
            decisionResult.decision,
            decisionResult.reason,
            decisionResult.policyId || null
        );
    } catch (e) {
        console.error('Failed to log decision:', e);
    }
}
