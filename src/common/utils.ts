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