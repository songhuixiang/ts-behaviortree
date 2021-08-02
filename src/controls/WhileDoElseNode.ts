import { NodeStatus } from '../BasicTypes';
import { ControlNode } from '../ControlNode';

export class WhileDoElseNode extends ControlNode<{}> {
    constructor(name: string) {
        super(name, {});
        this.setRegistrationID('WhileDoElse');
    }

    halt() {
        super.halt();
    }

    tick() {
        const children_count = this.children_nodes_.length;

        if (children_count != 3) {
            throw new Error('WhileDoElse must have either 2 or 3 children');
        }

        this.setStatus(NodeStatus.RUNNING);

        const condition_status = this.children_nodes_[0].executeTick();

        if (condition_status == NodeStatus.RUNNING) {
            return condition_status;
        }

        let status = NodeStatus.IDLE;

        if (condition_status == NodeStatus.SUCCESS) {
            this.haltChild(2);
            status = this.children_nodes_[1].executeTick();
        } else if (condition_status == NodeStatus.FAILURE) {
            this.haltChild(1);
            status = this.children_nodes_[2].executeTick();
        }

        if (status == NodeStatus.RUNNING) {
            return NodeStatus.RUNNING;
        } else {
            this.haltChildren();
            return status;
        }
    }
}
