import { ShowBuilding } from "../atoms/Building";
import useResourceBase from "../store/store";

export function BuildingList() {

    const allBuildings = useResourceBase((state) => state.buildings)
    return (
        <>
            {Object.keys(allBuildings).map(
                (key: string) => {
                    return <ShowBuilding building={key as keyof typeof allBuildings} />
                })}
        </>
    )
}