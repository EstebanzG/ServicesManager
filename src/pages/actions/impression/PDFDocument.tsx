import React from 'react';
import ReactPDF, {Document, Page, StyleSheet, Text} from '@react-pdf/renderer';
import {Classe, Periode, Service, StudentWithServiceDistrib, Week} from "../../../../database.types";
import View = ReactPDF.View;
import {findPeriodeNameById, findServiceNameById} from "../../../common/utils";


const styles = StyleSheet.create({
    body: {
        paddingTop: 35,
        paddingBottom: 65,
        paddingHorizontal: 35,
        fontSize: 12,
    },
    header: {
        marginBottom: 20,
        textAlign: 'center',
        color: 'grey',
    },
    pageNumber: {
        position: 'absolute',
        bottom: 30,
        left: 0,
        right: 0,
        textAlign: 'center',
        color: 'grey',
    },
    table_header: {
        display: 'flex',
        flexDirection: 'row',
        borderBottom: 1,
        padding: 1,
        width: '100%',
        fontWeight: "bold",
    },
    table_row: {
        display: 'flex',
        flexDirection: 'row',
        borderBottom: 1,
        padding: 1,
        width: '100%',
    },
    table_row_detail: {
        display: 'flex',
        flexDirection: 'row',
        width: '100%',
    },
    w_12: {
        width: '12%',
    },
    w_9_6: {
        width: '9.6%',
    },
    w_15: {
        width: '15%',
    },
    w_20: {
        width: '20%',
    }
})

interface props {
    students: StudentWithServiceDistrib[];
    services: Service[];
    periodes: Periode[]
    selectedClasse?: Classe;
    selectedWeek?: Week;
}

// Create Document Component
const PDFDocument = ({students, selectedClasse, selectedWeek, services, periodes}: props) => {
    return (
        <Document title={`Export_Service-${selectedWeek?.name}-${selectedClasse?.name ?? 'Toutes les classes'}`} >
            <Page size={'A4'} style={styles.body} orientation={"landscape"}>
                <Text style={styles.header} fixed>
                    {selectedWeek?.name} - {selectedClasse?.name ?? 'Toutes les classes'}
                </Text>
                <View style={styles.table_header}>
                    <Text style={styles.w_20}>Élève</Text>
                    <Text style={styles.w_20}>Service</Text>
                    <Text style={styles.w_12}>Lundi</Text>
                    <Text style={styles.w_12}>Mardi</Text>
                    <Text style={styles.w_12}>Mercredi</Text>
                    <Text style={styles.w_12}>Jeudi</Text>
                    <Text style={styles.w_12}>Vendredi</Text>
                </View>
                {students.map(student => (
                    <View style={styles.table_row} key={student.id}>
                        <View>
                            {student.service_distribution.length === 0 ?
                                <Text style={styles.w_20}>{student.lastname} {student.firstname}</Text> : null
                            }
                            {student.service_distribution.map((serviceDistrib) => (
                                <View style={styles.table_row_detail} key={serviceDistrib.id}>
                                    <Text style={styles.w_20}>{student.lastname} {student.firstname}</Text>
                                    <Text style={styles.w_20}>{findServiceNameById(services, serviceDistrib.service_id)}</Text>
                                    <Text
                                        style={styles.w_12}>{findPeriodeNameById(periodes, serviceDistrib.monday_periode)}</Text>
                                    <Text
                                        style={styles.w_12}>{findPeriodeNameById(periodes, serviceDistrib.thuesday_periode)}</Text>
                                    <Text
                                        style={styles.w_12}>{findPeriodeNameById(periodes, serviceDistrib.wednesday_periode)}</Text>
                                    <Text
                                        style={styles.w_12}>{findPeriodeNameById(periodes, serviceDistrib.thursday_periode)}</Text>
                                    <Text
                                        style={styles.w_12}>{findPeriodeNameById(periodes, serviceDistrib.friday_periode)}</Text>
                                </View>
                            ))}
                        </View>
                    </View>
                ))}
                <Text style={styles.pageNumber} render={({pageNumber, totalPages}) => (
                    `${pageNumber} / ${totalPages}`
                )} fixed/>
            </Page>
        </Document>
    )
};

export default PDFDocument;
