import SceneWrapper from '@/components/3d/SceneWrapper';
import RelationshipGraph from '@/components/3d/RelationshipGraph';
import { Card } from '@/components/ui/Card';

export default function GraphPage() {
    return (
        <div className="flex h-full flex-col gap-4 p-4">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white">Entity Graph</h1>
                    <p className="text-white/50">Explore relationships between Users, Roles, and Policies.</p>
                </div>
            </div>

            <div className="relative flex-1">
                <SceneWrapper cameraPosition={[0, 0, 15]}>
                    <RelationshipGraph />
                </SceneWrapper>

                <div className="absolute right-4 top-4 max-w-sm">
                    <Card className="bg-black/80">
                        <h3 className="font-medium text-white mb-2">Legend</h3>
                        <div className="space-y-2 text-sm">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-blue-500" />
                                <span className="text-white/70">Roles</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-rose-500" />
                                <span className="text-white/70">Policies</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-white" />
                                <span className="text-white/70">Users</span>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}
