import { NodeStatus } from '../BasicTypes';
import { DecoratorNode } from '../DecoratorNode';

/**
 * @brief The ForceSuccessNode returns always SUCCESS or RUNNING.
 */
export class ForceSuccessNode extends DecoratorNode<{}> {
    constructor(name: string) {
        super(name, {});
        this.setRegistrationID('ForceSuccess');
    }

    tick(): NodeStatus {
        this.setStatus(NodeStatus.RUNNING);

        const child_state = this.child().executeTick();

        switch (child_state) {
            case NodeStatus.FAILURE:
            case NodeStatus.SUCCESS: {
                return NodeStatus.SUCCESS;
            }
            case NodeStatus.RUNNING: {
                return NodeStatus.RUNNING;
            }
        }
        return this.status();
    }
}
