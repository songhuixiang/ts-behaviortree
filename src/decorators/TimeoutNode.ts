import { NodeStatus } from '../BasicTypes';
import { DecoratorNode } from '../DecoratorNode';

/**
 * @brief The TimeoutNode will halt() a running child if
 * the latter has been RUNNING for more than a give time.
 * The timeout is in milliseconds and it is passed using the port "msec".
 *
 * If timeout is reached it returns FAILURE.
 *
 */
export class TimeoutNode extends DecoratorNode<{}> {
    private timer_: NodeJS.Timer | undefined;
    private child_halted_: boolean;
    private msec_: number;
    private timeout_started_: boolean;

    constructor(name: string, milliseconds: number) {
        super(name, {});
        this.child_halted_ = false;
        this.msec_ = milliseconds;
        this.timeout_started_ = false;
        this.setRegistrationID('Timeout');
    }

    tick(): NodeStatus {
        if (!this.timeout_started_) {
            this.timeout_started_ = true;
            this.setStatus(NodeStatus.RUNNING);
            this.child_halted_ = false;

            if (this.msec_ > 0) {
                this.timer_ = setTimeout(() => {
                    if (this.child().status() == NodeStatus.RUNNING) {
                        this.child_halted_ = true;
                        this.haltChild();
                    }
                }, this.msec_);
            }
        }

        if (this.child_halted_) {
            this.timeout_started_ = false;
            return NodeStatus.FAILURE;
        } else {
            const child_status = this.child().executeTick();
            if (child_status != NodeStatus.RUNNING) {
                this.timeout_started_ = false;
                if (this.timer_) {
                    clearTimeout(this.timer_);
                    this.timer_ = undefined;
                }
            }
            return child_status;
        }
    }
}
