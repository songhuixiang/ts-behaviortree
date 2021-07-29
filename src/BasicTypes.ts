// Enumerates the states every node can be in after execution during a particular time step.
// IMPORTANT: Your custom nodes should NEVER return IDLE
export enum NodeStatus {
    IDLE = 0,
    RUNNING,
    SUCCESS,
    FAILURE,
}

export enum NodeType {
    UNDEFINED = 0,
    ACTION,
    CONDITION,
    CONTROL,
    DECORATOR,
    SUBTREE,
}
