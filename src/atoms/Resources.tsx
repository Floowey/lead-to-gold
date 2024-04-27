
import useStore, { AllResources } from "../store/store";

export function ShowResource(props: {resource:keyof AllResources}){

    const resTag = props.resource 
    const resources = useStore((state)=>state.resources)
    const inc = useStore((state)=>state.increment)
  
    const resource = resources[resTag]
    return (
      <>
        <h3>{resource?.name}: {resource?.amount.toFixed(2)}/{resource?.cap.toFixed(0)} ({resource?.increment.toFixed(2)}/s)
        {resource.manual > 0 && <button onClick={() => {inc(resTag, resource.manual)}}>+{resource.manual}</button>}
        </h3>
      </>
    );
};