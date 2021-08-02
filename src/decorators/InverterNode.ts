import { NodeStatus } from '../BasicTypes';
import { DecoratorNode } from '../DecoratorNode';

/**
 * @brief The InverterNode returns SUCCESS if child fails of FAILURE is child succeeds.
 * RUNNING status is propagated
 */
export class InverterNode extends DecoratorNode<{}> {
    constructor(name: string) {
        super(name, {});
        this.setRegistrationID('Inverter');
    }

    tick(): NodeStatus {
        this.setStatus(NodeStatus.RUNNING);

        const child_state = this.child().executeTick();

        switch (child_state) {
            case NodeStatus.SUCCESS: {
                return NodeStatus.FAILURE;
            }
            case NodeStatus.FAILURE: {
                return NodeStatus.SUCCESS;
            }
            case NodeStatus.RUNNING: {
                return NodeStatus.RUNNING;
            }
            default: {
                throw new Error('A child node must never return IDLE');
            }
        }
    }
}
