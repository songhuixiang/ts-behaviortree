import { AsyncActionNode } from '..';
import { NodeStatus } from '../BasicTypes';

class AsyncActionTest<T> extends AsyncActionNode<T> {
    public tick_count_: number = 0;

    tick(): Promise<NodeStatus> {
        this.tick_count_++;
        return new Promise(async (resolve) => {
            setTimeout(() => {
                resolve(NodeStatus.SUCCESS);
            }, 1000);
        });
    }
}

jest.useFakeTimers();
test('AsyncActionTest', () => {
    let action = new AsyncActionTest('test', {});
    action.executeTick();
    expect(action.status()).toBe(NodeStatus.RUNNING);
    expect(setTimeout).toHaveBeenCalledTimes(1);
    expect(setTimeout).toHaveBeenLastCalledWith(expect.any(Function), 1000);
});
