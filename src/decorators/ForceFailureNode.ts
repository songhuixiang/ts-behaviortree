import { NodeStatus } from '../BasicTypes';
import { DecoratorNode } from '../DecoratorNode';

/**
 * @brief The ForceFailureNode returns always FAILURE or RUNNING.
 */
export class ForceFailureNode extends DecoratorNode<{}> {
    constructor(name: string) {
        super(name, {});
        this.setRegistrationID('ForceFailure');
    }

    tick(): NodeStatus {
        this.setStatus(NodeStatus.RUNNING);

        const child_state = this.child().executeTick();

        switch (child_state) {
            case NodeStatus.FAILURE:
            case NodeStatus.SUCCESS: {
                return NodeStatus.FAILURE;
            }
            case NodeStatus.RUNNING: {
                return NodeStatus.RUNNING;
            }
        }
        return this.status();
    }
}
