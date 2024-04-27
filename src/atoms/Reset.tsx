import useStore from "../store/store";

export function ResetButton(){
    const reset = useStore((state) => state.clearAll)

    return (
          <button onClick={reset}>Reset</button>
      );
}