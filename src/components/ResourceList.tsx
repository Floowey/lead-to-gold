import { ShowResource } from "../atoms/Resources";
import useResourceBase from "../store/store";

export function ResourceList() {

    const allRes = useResourceBase((state) => state.resources)
    return (
        <>
            {Object.keys(allRes).map(
                (key: string) => {
                    return <ShowResource resource={key as keyof typeof allRes} />
                })}
        </>
    )
}