export const validateClass = (className: string, setFormErrors: (errors : Map<string, string[]>) => void
): boolean => {
    let errors = new Map<string, string[]>()
    let isValid = true;
    if (className === '') {
        errors.set('classe', ['Le nom de la classe est obligatoire']);
        isValid = false;
    }
    setFormErrors(errors);
    return isValid;
}