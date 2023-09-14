export const validateStudent = (firstname: string,
                                lastname: string,
                                classe: string,
                                setFormErrors: (errors : Map<string, string[]>) => void
): boolean => {
    let errors = new Map<string, string[]>()
    let isValid = true;
    if (firstname === '') {
        errors.set('firstName', ['Le prénom est obligatoire']);
        isValid = false;
    }
    if (lastname === '') {
        errors.set('lastName', ['Le nom est obligatoire']);
        isValid = false;
    }
    if (classe === '') {
        errors.set('classe', ['La classe est obligatoire']);
        isValid = false;
    }
    setFormErrors(errors);
    return isValid;
}