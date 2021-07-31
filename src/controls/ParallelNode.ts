import { NodeStatus } from '../BasicTypes';
import { ControlNode } from '../ControlNode';

export class ParallelNode extends ControlNode<{}> {
    private success_threshold_: number;
    private failure_threshold_: number;
    private skip_list_: Set<number>;

    constructor(name: string, success_threshold: number, failure_threshold: number = 1) {
        super(name, {});
        this.success_threshold_ = success_threshold;
        this.failure_threshold_ = failure_threshold;
        this.skip_list_ = new Set();
        this.setRegistrationID('Parallel');
    }

    public tick(): NodeStatus {
        let success_childred_num = 0;
        let failure_childred_num = 0;

        const children_count = this.children_nodes_.length;

        if (children_count < this.success_threshold_) {
            throw new Error('Number of children is less than threshold. Can never succeed.');
        }

        if (children_count < this.failure_threshold_) {
            throw new Error('Number of children is less than threshold. Can never fail.');
        }

        // Routing the tree according to the sequence node's logic:
        for (let i = 0; i < children_count; i++) {
            const child_node = this.children_nodes_[i];

            const in_skip_list = this.skip_list_.has(i);

            let child_status: NodeStatus;
            if (in_skip_list) {
                child_status = child_node.status();
            } else {
                child_status = child_node.executeTick();
            }

            switch (child_status) {
                case NodeStatus.SUCCESS:
                    {
                        if (!in_skip_list) {
                            this.skip_list_.add(i);
                        }
                        success_childred_num++;

                        if (success_childred_num == this.success_threshold_) {
                            this.skip_list_.clear();
                            this.haltChildren();
                            return NodeStatus.SUCCESS;
                        }
                    }
                    break;
                case NodeStatus.FAILURE:
                    {
                        if (!in_skip_list) {
                            this.skip_list_.add(i);
                        }
                        failure_childred_num++;

                        // It fails if it is not possible to succeed anymore or if
                        // number of failures are equal to failure_threshold_
                        if (
                            failure_childred_num > children_count - this.success_threshold_ ||
                            failure_childred_num == this.failure_threshold_
                        ) {
                            this.skip_list_.clear();
                            this.haltChildren();
                            return NodeStatus.FAILURE;
                        }
                    }
                    break;
                case NodeStatus.RUNNING:
                    {
                        // do nothing
                    }
                    break;
                default: {
                    throw new Error('A child node must never return IDLE');
                }
            }
        }
        return NodeStatus.RUNNING;
    }

    halt() {
        this.skip_list_.clear();
        super.halt();
    }

    thresholdM() {
        return this.success_threshold_;
    }

    thresholdFM() {
        return this.failure_threshold_;
    }

    setThresholdM(threshold_M: number) {
        this.success_threshold_ = threshold_M;
    }

    setThresholdFM(threshold_M: number) {
        this.failure_threshold_ = threshold_M;
    }
}
