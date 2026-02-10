import { CButton, CCard, CContainer } from '@coreui/react'
import { Link } from 'react-router-dom'
import CustomTable from 'src/components/customComponent/CustomTable'
import React, { useEffect, useState } from 'react'
import Loader from 'src/components/Loader'
import AdvanceCreationService from 'src/Service/Advance/AdvanceCreationService'
import DieselIntentCreationService from 'src/Service/DieselIntent/DieselIntentCreationService'

import AccessDeniedComponent from 'src/components/commoncomponent/AccessDeniedComponent'
import JavascriptInArrayComponent from 'src/components/commoncomponent/JavascriptInArrayComponent'
import * as LogisticsProScreenNumberConstants from 'src/components/constants/LogisticsProScreenNumberConstants'
import NlmtDieselIntentCreationService from 'src/Service/Nlmt/DieselIntent/NlmtDieselIntentCreationService'

const NlmtDieselIntentHome = () => {
  /*================== User Location Fetch ======================*/
  const user_info_json = localStorage.getItem('user_info')
  const user_info = JSON.parse(user_info_json)
  const user_locations = []

  /* Get User Locations From Local Storage */
  user_info.location_info.map((data, index) => {
    user_locations.push(data.id)
  })

  // console.log(user_locations)
  /*================== User Location Fetch ======================*/
/* ==================== Access Part Start ========================*/
const [screenAccess, setScreenAccess] = useState(false)
let page_no = LogisticsProScreenNumberConstants.DieselIntentModule.Diesel_Intent_Creation_Request

// useEffect(()=>{

//   if(user_info.is_admin == 1 || JavascriptInArrayComponent(page_no,user_info.page_permissions)){
//     console.log('screen-access-allowed')
//     setScreenAccess(true)
//   } else{
//     console.log('screen-access-not-allowed')
//     setScreenAccess(false)
//   }

// },[])
/* ==================== Access Part End ========================*/


  const [rowData, setRowData] = useState([])
  const [fetch, setFetch] = useState(false)
  let tableData = []
  const ACTION = {
    TRIPSHEET_CREATED: 16,
    SHIPMENT_CREATED: 22,
    RJ_SALES_ORDER: 35,
    TRIPSHEET_OWN_NLCD: 2,
    ADVANCE_CREATED: 18,
    TRIPSHEET_CREATED: 16,
  }

  const loadVehicleReadyToTrip = () => {
    NlmtDieselIntentCreationService.getVehicleReadyToDiesel().then((res) => {
      setFetch(true)
      tableData = res.data.data
      console.log(tableData)
      let rowDataList = []
      const filterData1 = tableData.filter(
        (data) => user_locations.indexOf(data.vehicle_location_id) != -1
      )
      // console.log(filterData)
      const filterData = filterData1.filter((data) => {
        // Get vehicle type id - handle both object and direct value
        const vehicleTypeId = data.vehicle_type_id?.id || data.vehicle_info?.vehicle_type_id || null;

        if (vehicleTypeId == '3' || vehicleTypeId == 3) {
          return data.trip_sheet_info && data.trip_sheet_info.advance_payment_diesel > '0';
        }
        return true; // Include all other vehicle types
      })

      filterData.map((data, index) => {
        rowDataList.push({
          sno: index + 1,
          Tripsheet_No: data.tripsheet_info?.nlmt_tripsheet_no,
          Tripsheet_Date: data.tripsheet_info?.created_date,
          Vehicle_Type: data.vehicle_type_id?.type || data.vehicle_info?.vehicle_type_id || 'N/A',
          Vehicle_No: data.vehicle_number || data.vehicle_info?.vehicle_number || 'N/A',
          Driver_Name: data.driver_name || data.driver_info?.driver_name || 'N/A',
          Waiting_At: (
            <span className="badge rounded-pill bg-info">
              {data.vehicle_current_position == ACTION.ADVANCE_CREATED &&
              data.parking_status == ACTION.OWN_TRIPSTO_AFTER_GATE_OUT_NLFD
                ? 'Trip STO(NLFD)'
                : data.vehicle_current_position == ACTION.ADVANCE_CREATED &&
                  data.parking_status == ACTION.OWN_TRIPSTO_AFTER_GATE_OUT_NLCD
                ? 'Trip STO(NLCD)'
                :data.vehicle_current_position == ACTION.TRIPSHEET_CREATED &&
                  data.parking_status == ACTION.OWN_TRIPSTO_AFTER_GATE_OUT_NLFD
                ? 'Trip STO(NLFD)'
                : data.vehicle_current_position == ACTION.TRIPSHEET_CREATED &&
                    data.parking_status == ACTION.OWN_TRIPSTO_AFTER_GATE_OUT_NLCD
                ? 'Trip STO(NLCD)'
                : (data.vehicle_current_position == ACTION.TRIPSHEET_CREATED || data.vehicle_current_position == ACTION.ADVANCE_CREATED) &&
                  data.parking_status == ACTION.HIRE_TRIPSTO_AFTER_GATE_OUT
                ? 'Trip STO(NLFD)'
                : (data.vehicle_current_position == ACTION.TRIPSHEET_CREATED || data.vehicle_current_position == ACTION.ADVANCE_CREATED) &&
                  data.parking_status == ACTION.HIRE_TRIPSTO_AFTER_GATE_OUT_NLCD
                ? 'Trip STO(NLCD)'
                : data.vehicle_current_position == ACTION.SHIPMENT_CREATED &&
                  data.parking_status == ACTION.OWN_FG_SALES_SHIPMENT_GATE_OUT_NLFD
                ? 'FG SALES(NLFD)'
                : data.vehicle_current_position == ACTION.NLCD_SHIPMENT_CREATED &&
                  data.parking_status == ACTION.OWN_FG_SALES_SHIPMENT_GATE_OUT_NLCD
                ? 'FG SALES(NLCD)'
                : data.vehicle_current_position == ACTION.SHIPMENT_CREATED &&
                  data.parking_status == ACTION.HIRE_FG_SALES_SHIPMENT_GATE_OUT_NLFD
                ? 'FG SALES(NLFD)'
                : data.vehicle_current_position == ACTION.NLCD_SHIPMENT_CREATED &&
                  data.parking_status == ACTION.HIRE_FG_SALES_SHIPMENT_GATE_OUT_NLCD
                ? 'FG SALES(NLCD)'
                : data.vehicle_current_position == ACTION.TRIPSHEET_CREATED &&
                  data.parking_status == ACTION.OWN_RMSTO_GATE_OUT
                ? 'RM STO'
                : data.vehicle_current_position == ACTION.TRIPSHEET_CREATED &&
                  data.parking_status == ACTION.OWN_FCI_GATE_OUT
                ? 'FCI'
                : data.vehicle_current_position == ACTION.SHIPMENT_CREATED
                ? 'FG Sale(NLMT)'
                : data.vehicle_current_position == ACTION.NLCD_SHIPMENT_CREATED
                ? 'Add FG Sale(NLCD)'
                : data.vehicle_current_position == ACTION.RJ_SALES_ORDER
                ? 'RJ Sales'
                : 'Diesel Intent Creation'}
            </span>
          ),
          advance_status:(
            <span className="badge rounded-pill bg-info">
              {(() => {
                const vehicleTypeId = data.vehicle_type_id?.id || data.vehicle_info?.vehicle_type_id || null;
                const advanceStatus = data.tripsheet_info?.advance_request;
            console.log("advanceStatus"+advanceStatus)
                if (advanceStatus == 0 ) {
                  return 'Advance ❌';
                } else if (advanceStatus == 1) {
                  return 'Advance ✅';
                }
                return '-';
              })()}
            </span>
          ),
          Screen_Duration: data.vehicle_current_position_updated_time,
          Overall_Duration: data.created_at,
          Action: (() => {
            const vehicleTypeId = data.vehicle_type_id?.id || data.vehicle_info?.vehicle_type_id || null;
            const advanceStatus = data.trip_sheet_info?.advance_status;
            const purpose = data.trip_sheet_info?.purpose;
            const isDisabled = vehicleTypeId < 3 && advanceStatus == 0 && purpose < 3;

            return (
              <CButton className="badge text-white" color="warning" disabled={isDisabled}>
                {isDisabled ? (
                  <span>Diesel Indent Creation</span>
                ) : (
                  <Link to={`${data.nlmt_trip_in_id}`}>Diesel Indent Creation</Link>
                )}
              </CButton>
            );
          })(),
        })
      })
      setRowData(rowDataList)
    })
  }

  useEffect(() => {
    loadVehicleReadyToTrip()
  }, [])

  const columns = [
    {
      name: 'S.No',
      selector: (row) => row.sno,
      sortable: true,
      center: true,
    },
    {
      name: 'Tripsheet Number',
      selector: (row) => row.Tripsheet_No,
      sortable: true,
      center: true,
    },
    {
      name: 'TripSheet Date',
      selector: (row) => row.Tripsheet_Date,
      sortable: true,
      center: true,
    },
    {
      name: 'Vehicle Type',
      selector: (row) => row.Vehicle_Type,
      sortable: true,
      center: true,
    },
    {
      name: 'Vehicle No',
      selector: (row) => row.Vehicle_No,
      sortable: true,
      center: true,
    },
    {
      name: 'Driver Name',
      selector: (row) => row.Driver_Name,
      sortable: true,
      center: true,
    },
    {
      name: 'Current Status',
      selector: (row) => row.Waiting_At,
      sortable: true,
      center: true,
    },
    {
      name: 'Advance Status',
      selector: (row) => row.advance_status,
      sortable: true,
      center: true,
    },
    {
      name: 'Screen Duration',
      selector: (row) => row.Screen_Duration,
      center: true,
    },
    {
      name: ' Overall Duration',
      selector: (row) => row.Overall_Duration,
      center: true,
    },
    {
      name: 'Action',
      selector: (row) => row.Action,
      center: true,
    },
  ]
  return (
    <>
      {!fetch && <Loader />}
      {fetch && (
        <>

          <CCard className="mt-4">
            <CContainer className="mt-1">
              <CustomTable
                columns={columns}
                data={rowData}
                fieldName={'Diesel_intent'}
                showSearchFilter={true}
              />
              <hr></hr>
            </CContainer>
          </CCard>

        </>
      )}
    </>
  )
}

export default NlmtDieselIntentHome
