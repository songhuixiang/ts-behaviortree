import { SyncActionNode } from '../ActionNode';
import { NodeStatus } from '../BasicTypes';

/**
 * Simple actions that always returns SUCCESS.
 */
export class AlwaysSuccessNode extends SyncActionNode<{}> {
    constructor(name: string) {
        super(name, {});
        this.setRegistrationID('AlwaysSuccess');
    }

    tick(): NodeStatus {
        return NodeStatus.SUCCESS;
    }
}
