import {supabase} from "../supabaseClient";
import {Classe, Periode, Service, StudentWithServiceDistrib, Week} from "../../../database.types";

export const loadWeeks = async (): Promise<Week[]> => {
    let {data} = await supabase
        .from('week')
        .select('*')
        .order('name')
    return data || [];
}

export const loadServices = async (): Promise<Service[]> => {
    let {data} = await supabase
        .from('service')
        .select('*')
        .order('name')
    return data || [];
}

export const loadStudentsWithServiceDistrib = async (weekId: string, classeId: string): Promise<StudentWithServiceDistrib[]> => {
    if (classeId === '') {
        let {data} = await supabase
            .from('student')
            .select('*, classe(*), service_distribution(*)')
            .eq('service_distribution.week_id', parseInt(weekId))
            .order('classe, lastname, firstname')
        return data ?? [];
    } else {
        let {data} = await supabase
            .from('student')
            .select('*, classe(*), service_distribution(*)')
            .eq('service_distribution.week_id', parseInt(weekId))
            .eq('classe', parseInt(classeId))
            .order('classe, lastname, firstname')
        return data || [];
    }
}

export const loadStudentsWithServiceDistribForPrint = async (weekId: string, classeId: string): Promise<StudentWithServiceDistrib[]> => {
    console.log(classeId)
    if (classeId !== '-1') {
        let {data} = await supabase
            .from('student')
            .select('*, classe(*), service_distribution(*)')
            .eq('service_distribution.week_id', parseInt(weekId))
            .eq('classe', parseInt(classeId))
            .order('lastname, firstname')
        return data || [];
    } else {
        let {data} = await supabase
            .from('student')
            .select('*, classe(*), service_distribution(*)')
            .eq('service_distribution.week_id', parseInt(weekId))
            .order('lastname, firstname')
        return data || [];
    }
}

export const loadPeriodes = async (): Promise<Periode[]> => {
    let {data} = await supabase
        .from('periode')
        .select('*')
        .order('name')
    return data || [];
}

export const loadClasses = async (): Promise<Classe[]> => {
    let {data} = await supabase
        .from('classe')
        .select('*')
        .order('name')
    return data || [];
}