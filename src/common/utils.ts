import {Periode, Service} from "../../database.types";

export const manageFirstAndLastPage =
    (nbOfClasses: number,
     range: number,
     rangeSize: number,
     setIsFirstPage : (isFirst : boolean) => void,
     setIsLastPage : (isLast: boolean) => void
    ) => {
    if (range - rangeSize < 0) {
        setIsFirstPage(true)
    } else {
        setIsFirstPage(false)
    }
    if (range + rangeSize <= nbOfClasses) {
        setIsLastPage(false)
    } else {
        setIsLastPage(true)
    }
}

export const findServiceNameById = (services: Service[],serviceId: number) => {
    return services.find(service => service.id === serviceId)?.name ?? '';
}

export const findPeriodeNameById = (periodes: Periode[], periodeName: number | null) => {
    return periodes.find(service => service.id === periodeName)?.name ?? '';
}