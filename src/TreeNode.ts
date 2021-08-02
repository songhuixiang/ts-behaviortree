import { NodeStatus, NodeType } from './BasicTypes';

export type StatusChangeCallback<T> = (node: TreeNode<T>, prevStatus: NodeStatus, newStatus: NodeStatus) => void;

let uid = 1;
function getUID() {
    return uid++;
}

export abstract class TreeNode<T> {
    private name_: string;
    private blackboard_: T;
    private status_: NodeStatus;
    private uid_: number;
    private statusChangeCallback: StatusChangeCallback<T> | undefined;
    private registration_ID_: string;

    constructor(name: string, blackboard: T) {
        this.name_ = name;
        this.blackboard_ = blackboard;
        this.status_ = NodeStatus.IDLE;
        this.uid_ = getUID();
        this.registration_ID_ = '';
    }

    public executeTick(): NodeStatus {
        const status = this.tick() as NodeStatus;
        this.setStatus(status);
        return status;
    }

    protected abstract tick(): NodeStatus | Promise<NodeStatus>;
    public abstract halt(): void;
    public abstract type(): NodeType;

    public isHalted(): boolean {
        return this.status_ === NodeStatus.IDLE;
    }

    public name(): string {
        return this.name_;
    }

    public UID(): number {
        return this.uid_;
    }

    public status(): NodeStatus {
        return this.status_;
    }

    public blackboard(): T {
        return this.blackboard_;
    }

    public waitValidStatus(): Promise<NodeStatus> {
        return new Promise((resolve, reject) => {
            const timer = setInterval(() => {
                if (!this.isHalted()) {
                    clearInterval(timer);
                    resolve(this.status_);
                }
            }, 0);
        });
    }

    protected setStatus(newStatus: NodeStatus) {
        let prevStatus: NodeStatus;
        [prevStatus, this.status_] = [this.status_, newStatus];
        if (prevStatus !== newStatus) {
            this.statusChangeCallback?.(this, prevStatus, newStatus);
        }
    }

    public subscribeToStatusChange(callback: StatusChangeCallback<T>) {
        this.statusChangeCallback = callback;
    }

    protected setRegistrationID(ID: string) {
        this.registration_ID_ = ID;
    }

    public registrationName(): string {
        return this.registration_ID_;
    }
}
