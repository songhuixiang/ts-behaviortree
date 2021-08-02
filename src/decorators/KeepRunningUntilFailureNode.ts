import { NodeStatus } from '../BasicTypes';
import { DecoratorNode } from '../DecoratorNode';

/**
 * @brief The KeepRunningUntilFailureNode returns always FAILURE or RUNNING.
 */
export class KeepRunningUntilFailureNode extends DecoratorNode<{}> {
    constructor(name: string) {
        super(name, {});
        this.setRegistrationID('KeepRunningUntilFailure');
    }

    tick(): NodeStatus {
        this.setStatus(NodeStatus.RUNNING);

        const child_state = this.child().executeTick();

        switch (child_state) {
            case NodeStatus.FAILURE: {
                return NodeStatus.FAILURE;
            }
            case NodeStatus.SUCCESS:
            case NodeStatus.RUNNING: {
                return NodeStatus.RUNNING;
            }
        }
        return this.status();
    }
}
