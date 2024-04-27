import useStore, {AllBuildings} from "../store/store";

export function ShowBuilding(props: {building:keyof AllBuildings}){

    const buildingTag = props.building 
    const buildings = useStore((state)=>state.buildings)
    const buyBuilding = useStore((state)=>state.buy)

    // useTick((dt) => incTick(resTag, dt))
    const building = buildings[buildingTag as keyof typeof buildings]
    return (
      <>
        <h3>
            {building.name} ({building.amount}) 
            {building.cost.map(r => <span>{(r.amount*r.costCreep**building.amount).toFixed(0)} {r.resource}</span>)}
            <button onClick={() => buyBuilding(buildingTag)}>+1</button>
        </h3>
      </>
    );
};