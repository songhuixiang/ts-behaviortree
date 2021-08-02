import { NodeStatus } from '../BasicTypes';
import { DecoratorNode } from '../DecoratorNode';

/**
 * @brief The delay node will introduce a delay of a few milliseconds
 * and then tick the child returning the status of the child as it is
 * upon completion
 *
 * During the delay the node changes status to RUNNING
 *
 */
export class DelayNode extends DecoratorNode<{}> {
    private delay_started_: boolean;
    private delay_complete_: boolean;
    private delay_aborted_: boolean;
    private msec_: number;
    private timer_: NodeJS.Timer | undefined;

    constructor(name: string, milliseconds: number) {
        super(name, {});
        this.delay_started_ = false;
        this.delay_aborted_ = false;
        this.delay_complete_ = false;
        this.msec_ = milliseconds;
        this.setRegistrationID('Delay');
    }

    halt() {
        this.delay_started_ = false;
        if (this.timer_) {
            clearTimeout(this.timer_);
            this.timer_ = undefined;
            this.delay_aborted_ = true;
        }
        super.halt();
    }

    tick(): NodeStatus {
        if (!this.delay_started_) {
            this.delay_complete_ = false;
            this.delay_aborted_ = false;
            this.delay_started_ = true;
            this.setStatus(NodeStatus.RUNNING);

            this.timer_ = setTimeout(() => {
                this.delay_complete_ = true;
                this.timer_ = undefined;
            }, this.msec_);
        }

        if (this.delay_aborted_) {
            this.delay_aborted_ = false;
            this.delay_started_ = false;
            return NodeStatus.FAILURE;
        } else if (this.delay_complete_) {
            this.delay_started_ = false;
            this.delay_aborted_ = false;
            const child_status = this.child().executeTick();
            return child_status;
        } else {
            return NodeStatus.RUNNING;
        }
    }
}
