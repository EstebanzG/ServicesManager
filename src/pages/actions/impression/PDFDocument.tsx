import React, {useEffect, useState} from 'react';
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';
import {Periode, Service, StudentWithServiceDistrib} from "../../../../database.types";
import {supabase} from "../../../common/supabaseClient";

const styles = StyleSheet.create({
    body: {
    },
    table: {
        padding: '50px',
    },
    row: {
        display: 'flex',
        justifyContent: "space-between",
        flexDirection: 'row',
        borderBottom: '1px',
        borderColor: 'grey',
    },
    text: {
        fontSize: '12px',
    },
    italic: {
        fontSize: '10px',
        fontStyle: 'italic',
    },
    row1: {
        width: '40%',
    },
    row2: {
        width: '55%',
    },
    serviceRow: {
        width: '100%',
        marginBottom: '15px',
    },
    serviceName: {
        marginBottom: '5',
    },
    borderRight: {
        height: '100%',
        borderRight: '1px',
        borderColor: 'grey',
    },
})

interface props {
    setIsGenerated: (isGenerated: boolean) => void;
    setIsLoad: (isLoad: boolean) => void;
    students: StudentWithServiceDistrib[];
}

// Create Document Component
const PDFDocument = ({students}: props) => {
    const [periodes, setPeriodes] = useState<Periode[]>([]);
    const [services, setServices] = useState<Service[]>([]);

    useEffect(() => {
        loadPeriodes().then()
        loadServices().then()
    }, []);

    const loadPeriodes = async () => {
        let {data} = await supabase
            .from('periode')
            .select('*')
            .order('name')
        setPeriodes(data || []);
    }

    const loadServices = async () => {
        let {data} = await supabase
            .from('service')
            .select('*')
            .order('name')
        setServices(data || []);
    }

    const findServiceNameById = (serviceId: number) => {
        return services.find(service => service.id === serviceId)?.name;
    }

    const findPeriodeNameById = (periodeName: number | null) => {
        return periodes.find(service => service.id === periodeName)?.name;
    }

    const formatPeriodesByStudentAndServiceId = (serviceId: number, student: StudentWithServiceDistrib): string => {
        let serviceDistrib = student.service_distribution.find(serviceDistrib => serviceDistrib.service_id === serviceId);
        if (serviceDistrib === undefined) {
            return ''
        }
        let periodes = [];
        if (serviceDistrib?.monday_periode !== null) {
            periodes.push('Lundi ' + findPeriodeNameById(serviceDistrib?.monday_periode));
        }
        if (serviceDistrib?.thuesday_periode !== null) {
            periodes.push('Mardi ' + findPeriodeNameById(serviceDistrib?.thuesday_periode));
        }
        if (serviceDistrib?.wednesday_periode !== null) {
            periodes.push('Mercredi ' + findPeriodeNameById(serviceDistrib?.wednesday_periode));
        }
        if (serviceDistrib?.thursday_periode !== null) {
            periodes.push('Jeudi ' + findPeriodeNameById(serviceDistrib?.thursday_periode));
        }
        if (serviceDistrib?.friday_periode !== null) {
            periodes.push('Vendredi ' + findPeriodeNameById(serviceDistrib?.friday_periode));
        }
        return periodes.join(' | ');
    }

    return (
        <Document>
            <Page style={styles.body}>
                <View style={styles.table}>
                    <View style={[styles.row]}>
                        <Text style={styles.row1}>NOM Prénom</Text>
                        <Text style={styles.row2}>Service(s)</Text>
                    </View>
                    {students.map((student) => (
                        <View key={student.id} style={styles.row} wrap={false}>
                            <View style={[styles.row1, styles.borderRight]}>
                                <Text style={styles.text}>{student.lastname}  {student.firstname}</Text>
                            </View>
                            <View style={styles.row2}>
                                {student.service_distribution.map(serviceDistrib => (
                                    <View key={serviceDistrib.id} style={styles.serviceRow}>
                                        <Text style={[styles.text, styles.serviceName]}>
                                            {findServiceNameById(serviceDistrib.service_id)}
                                        </Text>
                                        <Text style={styles.italic}>
                                            {formatPeriodesByStudentAndServiceId(serviceDistrib.service_id, student)}
                                        </Text>
                                    </View>
                                ))}
                            </View>
                        </View>
                    ))}
                </View>
            </Page>
        </Document>
    )
};

export default PDFDocument;
