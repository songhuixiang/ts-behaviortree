// /**
//  * @brief The SequenceNode is used to tick children in an ordered sequence.
//  * If any child returns RUNNING, previous children will NOT be ticked again.
//  *
//  * - If all the children return SUCCESS, this node returns SUCCESS.
//  *
//  * - If a child returns RUNNING, this node returns RUNNING.
//  *   Loop is NOT restarted, the same running child will be ticked again.
//  *
//  * - If a child returns FAILURE, stop the loop and return FAILURE.
//  *   Restart the loop only if (reset_on_failure == true)
//  *
//  */
// export abstract class SequenceNode : public ControlNode
// {
//   public:
//     SequenceNode(const std::string& name);

//     virtual ~SequenceNode() override = default;

//     virtual void halt() override;

//   private:
//     size_t current_child_idx_;

//     virtual BT::NodeStatus tick() override;
// };
