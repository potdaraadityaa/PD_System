import SceneWrapper from '@/components/3d/SceneWrapper';
import AuthorizationFlow from '@/components/3d/AuthorizationFlow';
import { Card } from '@/components/ui/Card';

export default function VisualizePage() {
    return (
        <div className="flex h-full flex-col gap-4 p-4">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white">Authorization Pipeline</h1>
                    <p className="text-white/50">Real-time visualization of access decisions.</p>
                </div>
                <div className="flex gap-2">
                    <div className="flex items-center gap-2 px-3 py-1 rounded bg-white/5 border border-white/10">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                        <span className="text-xs text-white/70">Engine Online</span>
                    </div>
                </div>
            </div>

            <SceneWrapper cameraPosition={[0, 2, 12]}>
                <AuthorizationFlow />
            </SceneWrapper>

            <div className="grid grid-cols-3 gap-4">
                <Card className="p-4">
                    <div className="text-xs text-white/40 mb-1">REQ/SEC</div>
                    <div className="text-xl font-mono text-white">42</div>
                </Card>
                <Card className="p-4">
                    <div className="text-xs text-white/40 mb-1">AVG LATENCY</div>
                    <div className="text-xl font-mono text-white">12ms</div>
                </Card>
                <Card className="p-4">
                    <div className="text-xs text-white/40 mb-1">LAST DECISION</div>
                    <div className="text-xl font-mono text-green-400">ALLOW</div>
                </Card>
            </div>
        </div>
    );
}
