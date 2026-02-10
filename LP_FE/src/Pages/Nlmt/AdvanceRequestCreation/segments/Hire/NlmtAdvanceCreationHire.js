
import { CCol, CFormInput, CFormLabel, CFormSelect, CFormTextarea, CRow, CInputGroup, CTableHeaderCell, CTable, CTableHead, CTableRow, CTableBody } from '@coreui/react'
import React, { useEffect, useState } from 'react'
import JavascriptInArrayComponent from 'src/components/commoncomponent/JavascriptInArrayComponent'
import ExpenseIncomePostingDate from 'src/Pages/TripsheetClosure/Calculations/ExpenseIncomePostingDate'
import DefinitionsListApi from 'src/Service/Definitions/DefinitionsListApi'
import NlmtDefinitionsListApi from 'src/Service/Nlmt/Masters/NlmtDefinitionsListApi'
import VendorOutstanding from 'src/Service/SAP/VendorOutstanding'

const NlmtAdvanceCreationHire = ({

  values,
  handleChange,
  onFocus,
  onBlur,
  singleVehicleInfo,
  isTouched,
  remarks,
  handleChangenew,
  setTotalFreightAmount,
  vendorMobileValue
}) => {
  const [errors, setErrors] = useState({})
  const [outstanding, setOutstanding] = useState('')
  const [TaxType, setTaxType] = useState([])
  const [GstTaxType, setGstTaxType] = useState([])
  // const [incoTableData, setIncoTableData] = useState([])

  const [currentDateVbr, setCurrentDateVbr] = useState(''); /* Vendor Bill Reference Date */
  const [currentDateAbp, setCurrentDateAbp] = useState(''); /* Advance Payment Bank Posting Date */
  const [currentDateFp, setCurrentDateFp] = useState(''); /* Freight Posting Date */
  const [vehicleCapacity, setVehicleCapacity] = useState([])
  const [vehicleBody, setVehicleBody] = useState([])
  const [advanceLimit, setadvanceLimit] = useState([])
  // const [values, setValues] = useState([])
  const VEHICLE_TYPE_MAP = {
    21: 'Own',
    22: 'Hire',
  }
  useEffect(() => {
    Promise.all([
      NlmtDefinitionsListApi.visibleNlmtDefinitionsListByDefinition(2),// Vehicle Capacity
      NlmtDefinitionsListApi.visibleNlmtDefinitionsListByDefinition(1),// Vehicle Body Type
      // NlmtDefinitionsListApi.visibleNlmtDefinitionsListByDefinition(3),// Vehicle Type
    ]).then(([cap, body, type]) => {
      setVehicleCapacity(cap.data.data || [])
      setVehicleBody(body.data.data || [])
      // setVehicleType(type.data.data || [])
      // setMastersLoaded(true)
    })
  }, [])
  const vehicleCapacityName = vehicleCapacity.find(
    (item) =>
      item.definition_list_id ===
      singleVehicleInfo?.vehicle_info?.vehicle_capacity_id
  )?.definition_list_name || '-'

  const vehicleBodyName = vehicleBody.find(
    (item) =>
      item.definition_list_id ===
      singleVehicleInfo?.vehicle_info?.vehicle_body_type_id
  )?.definition_list_name || '-'

  const handleChange1 = (e) => {
    const { name, value } = e.target
    const enteredAmount = Number(value)

    let newErrors = { ...errors }

    if (enteredAmount > Number(advanceEligible)) {
      newErrors.advance_payments =
        `Amount should not exceed eligible amount (${advanceEligible})`
    } else {
      delete newErrors.advance_payments
    }

    setErrors(newErrors)

    // ✅ pass the REAL event
    e.target.value = enteredAmount
    handleChange(e)
  }



  useEffect(() => {
    NlmtDefinitionsListApi.visibleNlmtDefinitionsListByDefinition(4)
      .then((res) => setadvanceLimit(res?.data?.data || []))
      .catch(() => setadvanceLimit([]))
  }, [])

  const getNumericCapacity = (capacityName) => {
    if (!capacityName) return 0
    return parseFloat(capacityName) || 0
  }
  const billedQty = Number(singleVehicleInfo?.vehicle_assignment?.[0]?.billed_qty || 0)
  const advancePercentage =
    advanceLimit?.find((item) => item.definition_list_status === 1)
      ?.definition_list_name || 0
const advanceEligible =
  ((Number(singleVehicleInfo?.tripsheet_info?.trip_vehicle_route?.freight_rate || 0) *
    billedQty *
    Number(advancePercentage)) / 100).toFixed(2)
const totalFreightAmount =
  Number(singleVehicleInfo?.tripsheet_info?.trip_vehicle_route?.freight_rate || 0) *
  billedQty

  useEffect(() => {
    if (!isNaN(totalFreightAmount) && totalFreightAmount > 0) {
      handleChange({
        target: {
          name: 'actual_freight',
          value: Math.round(totalFreightAmount),
        },
      })

      setTotalFreightAmount(Math.round(totalFreightAmount)) // ✅ now valid
    }
  }, [totalFreightAmount])

  useEffect(() => {
    // Set the current date in YYYY-MM-DD format
    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0]; // Extracts 'YYYY-MM-DD'
    setCurrentDateVbr(formattedDate);
    setCurrentDateAbp(formattedDate);
    setCurrentDateFp(formattedDate);
    values.sap_invoice_posting_date = formattedDate
    values.bank_date = formattedDate
    values.supplier_posting_date = formattedDate
  }, []);

useEffect(() => {
  if (singleVehicleInfo?.vendor_info?.vendor_code) {
    VendorOutstanding
      .getVendoroutstanding(singleVehicleInfo.vendor_info.vendor_code)
      .then((res) => {

        const vos = res?.data?.[0]?.L_DMBTR || ''

        console.log(vos, 'L_DMBTR')

        setOutstanding(vos)

        handleChange({
          target: {
            name: 'driver_outstanding',
            value: vos,
          },
        })
      })
  }
}, [singleVehicleInfo?.vendor_info?.vendor_code])


  function formatDate(date) {
    var d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2)
      month = '0' + month;
    if (day.length < 2)
      day = '0' + day;

    return [day, month, year].join('-');
  }
  const REQ = () => <span className="text-danger"> * </span>

  /* ===== User Inco Terms Declaration Start ===== */

  const [incoTermData, setIncoTermData] = useState([])

  useEffect(() => {

    /* section for getting Inco Term Lists from database */
    DefinitionsListApi.visibleDefinitionsListByDefinition(16).then((response) => {

      let viewData = response.data.data
      console.log(viewData, 'Inco Term Lists')

      let rowDataList_location = []
      viewData.map((data, index) => {
        rowDataList_location.push({
          sno: index + 1,
          incoterm_id: data.definition_list_id,
          incoterm_name: data.definition_list_name,
          incoterm_code: data.definition_list_code,
        })
      })

      setIncoTermData(rowDataList_location)
    })

  }, [])

  const ColoredLine = ({ color }) => (
    <hr
      style={{
        color: color,
        backgroundColor: color,
        height: 5
      }}
    />
  )

  const totalFreightvaluefinder = (type, Actual_Freight, Low_Tonnage_Charges) => {
    let ans = 0
    let ans1 = 0
    if (type == 1) {
      console.log(Actual_Freight, 'totalFreightvaluefinder-Inco_Term_wise_Freight')
    } else {
      console.log(Actual_Freight, 'totalFreightvaluefinder-Actual_Freight')
    }
    console.log(Low_Tonnage_Charges, 'totalFreightvaluefinder-Low_Tonnage_Charges')
    let Total_Freight = Number(Actual_Freight) + (Number.isInteger(Number(Low_Tonnage_Charges)) ? Number(Low_Tonnage_Charges) : 0)
    ans = Number(parseFloat(Total_Freight).toFixed(2))
    ans1 = Math.round(ans)
    console.log(ans1, 'totalFreightvaluefinder-totalFreightvalue')
    return ans1 ? ans1 : 0
  }
  const totalvaluefinder = (type, data) => {
    console.log(values, 'totalvaluefinder-values')
    console.log(type, 'totalvaluefinder-type')
    console.log(data, 'totalvaluefinder-data')

    let totval_type1 = 0
    let totval_type2 = 0
    let totval_type3 = 0

    if (data) {

      let children = data.shipment_child_info

      children.map((vv, kk) => {
        if (vv.invoice_uom == 'KG') {
          let qtty = Number(vv.invoice_net_quantity) / 1000
          console.log(qtty, 'totalvaluefinder1')
          totval_type1 = totval_type1 + qtty
          if (JavascriptInArrayComponent(vv.inco_term_id, [381, 382])) {
            //
          } else {
            totval_type3 = totval_type3 + qtty
          }

        } else {
          //
        }
        let ammt = freightamountfinder(vv.inco_term_id, values.frpt, getDeliveryQuantity(vv.invoice_net_quantity, vv.invoice_uom))
        console.log(ammt, 'totalvaluefinderammt')
        totval_type2 = totval_type2 + ammt
      })

      console.log(totval_type1, 'totalvaluefinder1')
      console.log(totval_type2, 'totalvaluefinder2')
      console.log(totval_type3, 'totalvaluefinder3')
    }
    if (type == 1) {
      return Number(parseFloat(totval_type1).toFixed(2))
    } else if (type == 2) {
      // return totval_type2
      return Math.round(totval_type2)
    } else if (type == 3) {
      return Number(parseFloat(totval_type3).toFixed(2))
    }
  }

  /* Display The Inco Term Name via Given Inco Term Code */
  const getIncoTermNameByCode = (code) => {

    console.log(incoTermData, 'getIncoTermNameByCode-incoTermData')
    console.log(code, 'getIncoTermNameByCode-code')

    let filtered_incoterm_data = incoTermData.filter((c, index) => {

      if (c.incoterm_id == code) {
        return true
      }
    })

    let incoTermName = filtered_incoterm_data[0] ? filtered_incoterm_data[0].incoterm_code : 'Loading..'

    return incoTermName
  }
  const [idt, setIdt] = useState([])
  // useEffect(()=>{
  //   if(singleVehicleInfo && singleVehicleInfo.shipment_info && singleVehicleInfo.shipment_info.length > 0 && incoTermData.length > 0){
  //     let shp = singleVehicleInfo.shipment_info[0]
  //     let shp_incoterm_array = []
  //     var incoTableData = []
  //     var do_array = []
  //     shp.shipment_child_info.map((vv,kk)=>{
  //       if(JavascriptInArrayComponent(vv.inco_term_id,shp_incoterm_array)){

  //         incoTableData.filter((data)=> (data.inco_term_id == vv.inco_term_id)).map((v1,k1)=>{
  //           let dArray = JSON.parse(JSON.stringify(v1.delivery_array))
  //           dArray.push(vv.delivery_no)
  //           v1.qty = v1.qty + getDeliveryQuantity(vv.invoice_net_quantity,vv.invoice_uom)
  //           v1.amount = v1.amount + freightamountfinder(vv.inco_term_id,singleVehicleInfo.trip_sheet_info.freight_rate_per_tone,getDeliveryQuantity(vv.invoice_net_quantity,vv.invoice_uom))
  //           v1.delivery_array = dArray
  //           dArray = []
  //         })
  //         // let old_qty = child_array_data[0].qty
  //         // let old_amount = child_array_data[0].amount
  //         // console.log(child_array_data[0],'incoTableData-child_array_data')

  //         // let valarray1 = {}
  //         // valarray1.inco_term_id = child_array_data[0].inco_term_id
  //         // valarray1.inco_term = child_array_data[0].inco_term
  //         // valarray1.qty = old_qty + getDeliveryQuantity(vv.invoice_net_quantity,vv.invoice_uom)
  //         // valarray1.amount = old_amount + freightamountfinder(vv.inco_term_id,singleVehicleInfo.trip_sheet_info.freight_rate_per_tone,getDeliveryQuantity(vv.invoice_net_quantity,vv.invoice_uom))

  //         // incoTableData.push(valarray1)

  //       } else {
  //         shp_incoterm_array.push(vv.inco_term_id)

  //         let valarray = {}

  //         let old_array = []
  //         old_array.push(vv.delivery_no)
  //         valarray.inco_term_id = vv.inco_term_id
  //         valarray.delivery_array =  old_array
  //         valarray.do = vv.delivery_no
  //         valarray.inco_term = getIncoTermNameByCode(vv.inco_term_id)
  //         valarray.qty = getDeliveryQuantity(vv.invoice_net_quantity,vv.invoice_uom)
  //         valarray.amount = freightamountfinder(vv.inco_term_id,singleVehicleInfo.trip_sheet_info.freight_rate_per_tone,getDeliveryQuantity(vv.invoice_net_quantity,vv.invoice_uom))
  //         console.log(valarray.amount,'incoTableData-valarray.amount')
  //         incoTableData.push(valarray)
  //       }
  //     })
  //     setIdt(incoTableData)
  //     values.incoterm_freight_info = JSON.stringify(incoTableData)
  //     console.log(incoTableData,'incoTableData1')
  //   } else {
  //     console.log('incoTableData2')
  //     setIdt([])
  //     values.incoterm_freight_info = ''
  //     console.log(singleVehicleInfo,'incoTableData21')
  //   }
  // },[incoTermData,singleVehicleInfo.shipment_info])



  // const getDeliveryQuantity = (qty,uom) => {
  //   if(uom == 'KG'){
  //     console.log(Number(qty)/1000,'getDeliveryQuantity')
  //     // return Number(parseFloat(qty).toFixed(2))
  //     return Number(qty)/1000
  //   } else {
  //     return '-'
  //   }
  // }

  const freightamountfinder = (id, ton, qty) => {
    console.log(id, 'freightamountfinder-id')
    console.log(ton, 'freightamountfinder-ton')
    console.log(qty, 'freightamountfinder-qty')
    if (JavascriptInArrayComponent(id, [381, 382])) {
      return 0
    }
    let ans = Number(ton) * qty
    console.log(ans, 'freightamountfinder-ans')
    // return Math.round(ans)
    return Number(ans)
    // return parseInt(ans)
  }

  /* ===== User Inco Terms Declaration End ===== */



  const datevalidation = function () {

    let today = new Date();
    today.setDate(today.getDate() - 3);

    let dd = today.getDate();
    let mm = today.getMonth() + 1;
    let yyyy = today.getFullYear();

    if (dd < 10) {
      dd = '0' + dd
    }
    if (mm < 10) {
      mm = '0' + mm
    }

    today = yyyy + '-' + mm + '-' + dd;

    return today;
  }

  const bankAmountExists = (v1, v2, v3) => {
    console.log(v1, 'bankAmountExists:Freight-Tonnage-Amount')
    console.log(v2, 'bankAmountExists:Bank-Advance-Amount')
    console.log(v3, 'bankAmountExists:Diesel-Advance-Amount')
    let lowtoncharge = values.low_tonnage_charges
    let Total_Freight = Number(v1) + (Number.isInteger(Number(lowtoncharge)) ? Number(lowtoncharge) : 0)
    let alloted_amount = Total_Freight * 4 / 5
    let alloted_amount1 = Math.round(alloted_amount)
    console.log(alloted_amount1, 'bankAmountExists:80%-Advance-Amount')
    let bank_advance_allowed_amount = alloted_amount1 - v3
    let bank_advance_allowed_amount1 = Math.round(bank_advance_allowed_amount)
    console.log(bank_advance_allowed_amount, 'bankAmountExists:bank_advance_allowed_amount')
    if (v2 > bank_advance_allowed_amount1) {
      return 101
    }
    return 102
  }

  const bank_advance_limit_finder = (type, lowtoncharge, v3) => {

    let v1 = 0
    if (type == 1) {
      v1 = totalvaluefinder(2, singleVehicleInfo.shipment_info[0])
    } else {
      v1 = values.actual_freight
    }

    let Total_Freight = Number(v1) + (Number.isInteger(Number(lowtoncharge)) ? Number(lowtoncharge) : 0)
    let alloted_amount = Total_Freight * 4 / 5
    let alloted_amount1 = Math.round(alloted_amount)

    let bank_advance_allowed_amount = alloted_amount1 - v3
    let bank_advance_allowed_amount1 = Math.round(bank_advance_allowed_amount)
    console.log(bank_advance_allowed_amount1, 'bank_advance_limit_finder-bank_advance_allowed_amount')

    // return bank_advance_allowed_amount
    return Math.round(bank_advance_allowed_amount1)
  }

  const eightypercentage_freight_finder = (v1, lowtoncharge) => {
    let Total_Freight = Number(v1) + (Number.isInteger(Number(lowtoncharge)) ? Number(lowtoncharge) : 0)
    let alloted_amount = Total_Freight * 4 / 5
    console.log(alloted_amount, 'eightypercentage_freight_finder-amount')
    // return alloted_amount
    return Math.round(alloted_amount)
  }

  const Expense_Income_Posting_Date = ExpenseIncomePostingDate();
  // console.log(Expense_Income_Posting_Date,'ExpenseIncomePostingDate')

  const [Balance, setBalance] = useState('')
  const [TotalValue, setTotalValue] = useState('')

  useEffect(() => {
    const freight =
      singleVehicleInfo?.tripsheet_info?.trip_vehicle_route?.freight_rate || 0

    const advance = values?.advance_payments || 0

    setBalance(Number(advance) - Number(freight))
  }, [values.advance_payments, singleVehicleInfo])


  useEffect(() => {
    DefinitionsListApi.visibleDefinitionsListByDefinition(3).then((response) => {
      let tableData = response.data.data
      const filterData = tableData.filter((data) => (data.definition_list_status == 1))
      setTaxType(filterData)
    })
  }, [])

  useEffect(() => {
    DefinitionsListApi.visibleDefinitionsListByDefinition(20).then((response) => {
      let tableData = response.data.data
      const filterData = tableData.filter((data) => (data.definition_list_status == 1))
      setGstTaxType(filterData)
    })
  }, [])

  console.log(Balance)

  const [tdsMasterData, setTdsMasterData] = useState([])
  const [sapHsnData, setSapHsnData] = useState([])
  const [frpt1, setFrpt1] = useState('')

  useEffect(() => {
    /* section for getting Sap Hsn Data from database */
    DefinitionsListApi.visibleDefinitionsListByDefinition(27).then((response) => {
      console.log(response.data.data, 'DefinitionsListApi-setSapHsnData')
      setSapHsnData(response.data.data)
    })

    /* section for getting TDS Master Data from database */
    DefinitionsListApi.visibleDefinitionsListByDefinition(3).then((response) => {
      console.log(response.data.data, 'DefinitionsListApi-setTdsMasterData')
      let tableData = response.data.data
      let filterData = tableData.filter((data) => (data.definition_list_status == 1))
      setTdsMasterData(filterData)
    })
  }, [])


  // const [mgiTime, setMgiTime] = useState('');

  const frptUpdate = (eve) => {
    let need_val = eve.target.value.replace(/\D/g, '')
    console.log(need_val)
    // values.frpt = need_val
    setFrpt1(need_val)
  }
  console.log(singleVehicleInfo, '001singleVehicleInfo')
  return (
    <>
      <CRow>
        <CCol xs={12} md={3}>
          <CFormLabel htmlFor="tripsheet_id">
            Trip Sheet Number
          </CFormLabel>
          <CFormInput
            size="sm"
            // name="tripsheet_sheet_id"
            onFocus={onFocus}
            onBlur={onBlur}
            onChange={handleChange}
            value={singleVehicleInfo.tripsheet_info.nlmt_tripsheet_no}
            // value={singleVehicleInfo.tripsheet_sheet_id}
            // id="tripsheet_id"
            type="text"
            readOnly
          />
        </CCol>
        <CCol xs={12} md={3}>
          <CFormLabel htmlFor="vNum">Vehicle Number</CFormLabel>
          <CFormInput size="sm" id="vNum" value={singleVehicleInfo.vehicle_info.vehicle_number} readOnly />
        </CCol>

        <CCol xs={12} md={3}>
          <CFormLabel htmlFor="shedName">Shed Name</CFormLabel>
          <CFormInput
            size="sm"
            id="shedName"
            value={singleVehicleInfo.vendor_info.nlmt_shed_info.shed_name}
            readOnly
          />
        </CCol>
        <CCol xs={12} md={3}>
          <CFormLabel htmlFor="ownerMob">Shed Owner Mobile Number</CFormLabel>
          <CFormInput
            size="sm"
            id="ownerMob"
            value={singleVehicleInfo.vendor_info?.nlmt_shed_info?.shed_owner_phone_1 || singleVehicleInfo.vendor_info?.shed_info.shed_owner_phone_1}
            type="text"
            readOnly
          />
        </CCol>
        <CCol xs={12} md={3}>
          <CFormLabel htmlFor="vendor_code">
            Vendor Code
            {/* {errors.vendor_code && (
              <span className="small text-danger">{errors.vendor_code}</span>
            )} */}
          </CFormLabel>
          <CInputGroup>
            <CFormInput
              size="sm"
              name="vendor_code"
              onFocus={onFocus}
              onBlur={onBlur}
              value={singleVehicleInfo.vendor_info.vendor_code}
              //onChange={handleChange}
              id="vendor_code"
              type="text"
              readOnly
            />
          </CInputGroup>
        </CCol>
        <CCol xs={12} md={3}>
          <CFormLabel htmlFor="ownerName">Vendor Name</CFormLabel>
          <CFormInput
            size="sm"
            id="ownerName"
            type="text"
            value={singleVehicleInfo.vendor_info?.owner_name || singleVehicleInfo?.vendor_info?.owner_name}
            readOnly
          />
        </CCol>
        <CCol xs={12} md={3}>
          <CFormLabel htmlFor="ownerMob">Vendor PAN Number</CFormLabel>
          <CFormInput
            size="sm"
            id="ownerMob"
            value={singleVehicleInfo?.vendor_info?.pan_card_number || singleVehicleInfo?.vendor_info?.pan_card_number}
            type="text"
            readOnly
          />
        </CCol>
        <CCol xs={12} md={3}>
          <CFormLabel htmlFor="ownerMob">Vendor Mobile Number</CFormLabel>
          <CFormInput
            size="sm"
            id="ownerMob"
            value={singleVehicleInfo?.vendor_info?.owner_number || singleVehicleInfo?.vendor_info?.owner_number}
            type="text"
            readOnly
          />
        </CCol>
        <CCol xs={12} md={3}>
          <CFormLabel htmlFor="vCap">Vehicle Capacity</CFormLabel>
          <CFormInput
            size="sm"
            id="vCap"
            value={`${VEHICLE_TYPE_MAP[singleVehicleInfo?.vehicle_info?.vehicle_type_id] || '-'
              } / ${vehicleCapacityName || '-'
              } Mts / ${vehicleBodyName || '-'
              }`}
            readOnly
          />
        </CCol>


        <CCol xs={12} md={3}>
          <CFormLabel htmlFor="driver_outstanding">
            Vendor Current O/S in SAP
            {errors.driver_outstanding && (
              <span className="small text-danger">{errors.driver_outstanding}</span>
            )}
          </CFormLabel>
          <CFormInput
            size="sm"
            name="driver_outstanding"
            onFocus={onFocus}
            onBlur={onBlur}
            value={values.driver_outstanding || ''}
            onChange={outstanding}
            id="driver_outstanding"
            type="text"
            readOnly
          />
        </CCol>
        <CCol xs={12} md={3}>
          <CFormLabel htmlFor="driverNameHire">Driver Name</CFormLabel>
          <CFormInput
            size="sm"
            id="driverNameHire"
            value={singleVehicleInfo.driver_name}
            readOnly
          />
        </CCol>
        {/* </CRow>
      <CRow>
        <CCol xs={12} md={3}>
          <CFormLabel htmlFor="dMob">Driver Mobile Number</CFormLabel>
          <CFormInput
            size="sm"
            id="dMob"
            value={singleVehicleInfo.driver_contact_number}
            readOnly
          />
        </CCol> */}
        {/* {singleVehicleInfo.trip_sto_status !== '1' && (
          <>
            <CCol xs={12} md={3}>
              <CFormLabel htmlFor="gateInDateTime">Gate-In Date & Time</CFormLabel>
              <CFormInput
                size="sm"
                id="gateInDateTime"
                type="text"
                value={singleVehicleInfo.gate_in_date_time_string}
                readOnly
              />
            </CCol>
            <CCol xs={12} md={3}>
              <CFormLabel htmlFor="inspectionDateTime">Inspection Date & Time</CFormLabel>
              <CFormInput
                size="sm"
                id="inspectionDateTime"
                type="text"
                value={
                  singleVehicleInfo.vehicle_inspection_trip
                    ? singleVehicleInfo.vehicle_inspection_trip.inspection_time_string
                    : 'RMSTO'
                }
                readOnly
              />
            </CCol>
            <CCol xs={12} md={3}>
              <CFormLabel htmlFor="verifyDate">Doc. Verification Date & Time</CFormLabel>
              <CFormInput
                size="sm"
                type="inspection_time_string"
                id="verifyDate"
                value={
                  singleVehicleInfo.vehicle_inspection_trip
                    ? singleVehicleInfo.vehicle_inspection_trip.inspection_time_string
                    : 'RMSTO'
                }
                readOnly
              />
            </CCol>
          </>
        )} */}

        <CCol xs={12} md={3}>
          <CFormLabel htmlFor="gst_tax_type">GST Tax Type <REQ />{' '}
            {errors.gst_tax_type && (
              <span className="small text-danger">{errors.gst_tax_type}</span>
            )}
          </CFormLabel>
          <CFormSelect
            size="sm"
            id="gst_tax_type"
            name="gst_tax_type"
            value={values.gst_tax_type}
            className={`${errors.gst_tax_type && 'is-invalid'}`}
            type="text"
            maxLength="6"
            onFocus={onFocus}
            onBlur={onBlur}
            onChange={handleChange}
          >
            <option value="">Select...</option>
            {/* <option value="Empty">No Tax</option>
              <option value="R5">Input Tax RCM (SGST,CGST @ 2.5% & 2.5%)</option>
              <option value="F6">Input Tax (SGST,CGST @ 6% & 6%)</option> */}
            {GstTaxType.map(({ definition_list_code, definition_list_name }) => {
              return (
                <>
                  <option key={definition_list_code} value={definition_list_code}>
                    {definition_list_name}
                  </option>
                </>
              )
            })}
          </CFormSelect>
        </CCol>

        <CCol xs={12} md={3}>
          <CFormLabel htmlFor="vendor_hsn">
            HSN Code <REQ />{' '}
          </CFormLabel>
          <CFormSelect
            size="sm"
            name="vendor_hsn"
            onFocus={onFocus}
            onBlur={onBlur}
            onChange={handleChange}
            value={values.vendor_hsn}
            className={`${errors.vendor_hsn && 'is-invalid'}`}
            aria-label="Small select example"
          >
            <option value="">Select</option>

            {sapHsnData.map(({ definition_list_code, definition_list_name }) => {
              if (definition_list_code) {
                return (
                  <>
                    <option
                      key={definition_list_code}
                      value={definition_list_code}
                    >
                      {definition_list_name}
                    </option>
                  </>
                )
              }
            })}
          </CFormSelect>
        </CCol>
        <CCol xs={12} md={3}>
          <CFormLabel htmlFor="sap_invoice_posting_date">
            Freight Posting Date <REQ />{' '}
            {errors.sap_invoice_posting_date && (
              <span className="small text-danger">{errors.sap_invoice_posting_date}</span>
            )}
          </CFormLabel>
          <CFormInput
            size="sm"
            type="date"
            name="sap_invoice_posting_date"
            id="sap_invoice_posting_date"
            onFocus={onFocus}
            onBlur={onBlur}
            // onChange={handleChange}
            // value={values.sap_invoice_posting_date}
            value={currentDateFp}
            onChange={(e) => {
              setCurrentDateFp(e.target.value)
              values.sap_invoice_posting_date = e.target.value
            }}
            min={Expense_Income_Posting_Date.min_date}
            max={Expense_Income_Posting_Date.max_date}
            onKeyDown={(e) => {
              e.preventDefault();
            }}
          />
        </CCol>
        <CCol className="mb-3" md={3}>
          <CFormLabel htmlFor="vendor_tds">
            TDS Tax Type<REQ />{' '}
          </CFormLabel>
          <CFormSelect
            size="sm"
            id="vendor_tds"
            className={`${errors.vendor_tds && 'is-invalid'}`}
            name="vendor_tds"
            value={values.vendor_tds}
            onFocus={onFocus}
            onChange={handleChange}
            onBlur={onBlur}
          >
            <option value="">Select</option>
            <option value="0">No Tax</option>

            {tdsMasterData.map(({ definition_list_code, definition_list_name }) => {
              if (definition_list_code) {
                return (
                  <>
                    <option
                      key={definition_list_code}
                      value={definition_list_code}
                    >
                      {definition_list_name}
                    </option>
                  </>
                )
              }
            })}
          </CFormSelect>
        </CCol>
        <CCol xs={12} md={3}>
          <CFormLabel htmlFor="advance_payments">
            Advance Payment Banks <REQ />{' '}
            {errors.advance_payments && (
              <span className="small text-danger">{errors.advance_payments}</span>
            )}
          </CFormLabel>
          <CFormInput
            size="sm"
            type="number"
            onFocus={onFocus}
            onBlur={onBlur}
            onChange={handleChange1}
            value={values.advance_payments}
            name="advance_payments"
            id="advance_payments"
            maxLength={6}
          />
        </CCol>

        {values.advance_payments > 0 &&
          <CCol xs={12} md={3}>
            <CFormLabel htmlFor="bank_date">
              Advance Payment Bank Posting Date <REQ />{' '}
            </CFormLabel>
            <CFormInput
              size="sm"
              type="date"
              name="bank_date"
              id="bank_date"
              onFocus={onFocus}
              onBlur={onBlur}
              // onChange={handleChange}
              value={currentDateAbp}
              onChange={(e) => {
                setCurrentDateAbp(e.target.value)
                values.bank_date = e.target.value
              }}
              // value={values.bank_date}
              min={Expense_Income_Posting_Date.min_date}
              max={Expense_Income_Posting_Date.max_date}
              onKeyDown={(e) => {
                e.preventDefault();
              }}
            />
          </CCol>
        }

        {/* <CCol xs={12} md={3}>
          <CFormLabel htmlFor="expected_date_time">
            Expected Delivery Date
            {errors.expected_date_time && (
              <span className="small text-danger">{errors.expected_date_time}</span>
            )}
          </CFormLabel>
          <CFormInput
            size="sm"
            onFocus={onFocus}
            onBlur={onBlur}
            onChange={handleChange}
            value={formatDate(singleVehicleInfo.trip_sheet_info.expected_date_time || '')}
            type="text"
            name="expected_date_time"
            id="expected_date_time"
            readOnly
          />
        </CCol> */}
        <CCol xs={12} md={3}>
          <CFormLabel htmlFor="supplier_ref_no">Vendor Bill No/Reference
            {errors.supplier_ref_no && (
              <span className="small text-danger">{errors.supplier_ref_no}</span>
            )}
          </CFormLabel>
          <CFormInput
            size="sm"
            id="supplier_ref_no"
            name="supplier_ref_no"
            value={values.supplier_ref_no}
            type="text"
            maxLength="16"
            onFocus={onFocus}
            onBlur={onBlur}
            onChange={handleChange}
          />
        </CCol>
        <CCol xs={12} md={3}>
          <CFormLabel htmlFor="supplier_posting_date">Vendor Bill/Reference Date<REQ />{' '}
            {errors.supplier_posting_date && (
              <span className="small text-danger">{errors.supplier_posting_date}</span>
            )}
          </CFormLabel>
          <CFormInput
            size="sm"
            id="supplier_posting_date"
            name="supplier_posting_date"
            // value={values.supplier_posting_date}
            value={currentDateVbr}
            onChange={(e) => {
              setCurrentDateVbr(e.target.value)
              values.supplier_posting_date = e.target.value
            }}
            type="date"
            onFocus={onFocus}
            onBlur={onBlur}
          />
        </CCol>
        <CCol xs={12} md={3}>
          <CFormLabel htmlFor="remarks">Accounting Remarks<REQ /></CFormLabel>
          <CFormTextarea
            id="remarks"
            name="remarks"
            onFocus={onFocus}
            onBlur={onBlur}
            onChange={handleChangenew}
            value={remarks}
            rows="1"
            maxLength={"50"}
          >
          </CFormTextarea>
        </CCol>

        {values.advance_payments > "0" &&
          <CCol xs={12} md={3}>
            <CFormLabel htmlFor="bank_remarks">Bank Payment Remarks<REQ /></CFormLabel>
            <CFormTextarea
              id="bank_remarks"
              name="bank_remarks"
              onFocus={onFocus}
              onBlur={onBlur}
              onChange={handleChange}
              value={values.bank_remarks}
              rows="1"
              maxLength={"50"}
            >
            </CFormTextarea>
          </CCol>
        }





        <ColoredLine color="red" />

        <CRow className="mt-2" hidden>
          <CCol xs={12} md={3}>
            <CFormLabel htmlFor="trip_route">
              Trip Route
              {errors.freight_rate_per_tone && (
                <span className="small text-danger">{errors.trip_route}</span>
              )}
            </CFormLabel>
            <CFormInput
              size="sm"
              onFocus={onFocus}
              onBlur={onBlur}
              value={singleVehicleInfo.tripsheet_info.trip_vehicle_route.route_name}
              id="trip_route"
              name="trip_route"
              type="text"
              readOnly
            />
          </CCol>
          <CCol xs={12} md={3}>
            <CFormLabel htmlFor="actual_freight">
              Freight Per Ton
              {/* {errors.actual_freight && (
                       <span className="small text-danger">{errors.actual_freight}</span>
                     )} */}
            </CFormLabel>
            <CFormInput
              size="sm"
              onFocus={onFocus}
              onBlur={onBlur}
              value={singleVehicleInfo.tripsheet_info.trip_vehicle_route.freight_rate}
              id="actual_freight"
              name="actual_freight"
              type="text"
              disabled
              maxLength={6}
            />
          </CCol>
          <CCol xs={12} md={3}>
            <CFormLabel htmlFor="actual_freight">
              Billed Qty In MTS
              {/* {errors.actual_freight && (
                       <span className="small text-danger">{errors.actual_freight}</span>
                     )} */}
            </CFormLabel>
            <CFormInput
              size="sm"
              onFocus={onFocus}
              onBlur={onBlur}
              value={singleVehicleInfo?.vehicle_assignment?.[0]?.billed_net_qty || 0}
              id="actual_freight"
              name="actual_freight"
              type="text"
              disabled
              maxLength={6}
            />
          </CCol>
          <CCol xs={12} md={3}>
            <CFormLabel htmlFor="actual_freight">
              Total Freight Amount
              {/* {errors.actual_freight && (
                       <span className="small text-danger">{errors.actual_freight}</span>
                     )} */}
            </CFormLabel>
            <CFormInput
              size="sm"
              onFocus={onFocus}
              onBlur={onBlur}
              value={totalFreightAmount}
              id="actual_freight"
              name="actual_freight"
              type="text"
              disabled
              maxLength={6}
            />
          </CCol>

          <CCol md={3}>
            <CFormLabel>
              Advance Eligible {advancePercentage} %
            </CFormLabel>
            <CFormInput
              size="sm"
              type="number"
              value={advanceEligible}
              readOnly
            />
          </CCol>
          <CCol xs={12} md={2}>
            <CFormLabel htmlFor="balance_amount">
              Balance Trip Amount
            </CFormLabel>
            <CFormInput
              size="sm"
              name="balance_amount"
              type="text"
              onFocus={onFocus}
              onBlur={onBlur}
              value={isNaN(Number(Balance)) ? '0' : Balance}
              id="income_freight"
              readOnly
            />
          </CCol>
        </CRow>
        <ColoredLine color="red" />

        {/* {singleVehicleInfo.shipment_info.length > 0 &&
          (
            <>
              <CRow className="mt-2" hidden>
                <CCol xs={12} md={3}>
                  <CFormLabel
                    htmlFor="inputAddress"
                    style={{
                      backgroundColor: '#4d3227',
                      margin: '15px 0',
                      color: 'white',
                    }}
                  >
                    Shipment Deliveries Wise Freight Information
                  </CFormLabel>
                </CCol>
              </CRow>
              <CRow>
                <CTable style={{ height: '40vh', width: 'auto' }} className="overflow-scroll">
                  <CTableHead style={{ backgroundColor: '#4d3227', color: 'white' }}>
                    <CTableRow style={{ width: '100%' }}>

                      <CTableHeaderCell
                        scope="col"
                        style={{ color: 'white', width: '5%', textAlign: 'center' }}
                      >
                        S.No
                      </CTableHeaderCell>

                      <CTableHeaderCell
                        scope="col"
                        style={{ color: 'white', width: '5%', textAlign: 'center' }}
                      >
                        Delivery No.
                      </CTableHeaderCell>

                      <CTableHeaderCell
                        scope="col"
                        style={{ color: 'white', width: '9%', textAlign: 'center' }}
                      >
                        Inco Term
                      </CTableHeaderCell>

                      <CTableHeaderCell
                        scope="col"
                        style={{ color: 'white', width: '5%', textAlign: 'center' }}
                      >
                        QTY in MTS
                      </CTableHeaderCell>

                      <CTableHeaderCell
                        scope="col"
                        style={{ color: 'white', width: '5%', textAlign: 'center' }}
                      >
                        Rate Per TON
                      </CTableHeaderCell>

                      <CTableHeaderCell
                        scope="col"
                        style={{ color: 'white', width: '5%', textAlign: 'center' }}
                      >
                        Amount
                      </CTableHeaderCell>

                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                  {singleVehicleInfo.shipment_info[0].shipment_child_info.map((data, index) => {
                      console.log(data,'rowData-data')

                      return (
                        <>
                          <CTableRow style={{ width: '100%' }}>

                            <CTableHeaderCell
                              scope="col"
                              style={{ width: '5%', textAlign: 'center' }}
                            >
                              {index+1}
                            </CTableHeaderCell>

                            <CTableHeaderCell
                              scope="col"
                              style={{ width: '5%', textAlign: 'center' }}
                            >
                              {data.delivery_no}
                            </CTableHeaderCell>

                            <CTableHeaderCell
                              scope="col"
                              style={{ width: '9%', textAlign: 'center' }}
                            >
                              {getIncoTermNameByCode(data.inco_term_id)}
                            </CTableHeaderCell>

                            <CTableHeaderCell
                              scope="col"
                              style={{ width: '5%', textAlign: 'center' }}
                            >

                              {getDeliveryQuantity(data.invoice_net_quantity,data.invoice_uom)}
                            </CTableHeaderCell>

                            <CTableHeaderCell
                              scope="col"
                              style={{ width: '5%', textAlign: 'center' }}
                            >
                              {JavascriptInArrayComponent(data.inco_term_id,[381,382]) ? 0 : singleVehicleInfo.trip_sheet_info.freight_rate_per_tone}
                            </CTableHeaderCell>

                            <CTableHeaderCell
                              scope="col"
                              style={{ width: '5%', textAlign: 'center' }}
                            >
                              {freightamountfinder(data.inco_term_id,singleVehicleInfo.trip_sheet_info.freight_rate_per_tone,getDeliveryQuantity(data.invoice_net_quantity,data.invoice_uom))}
                            </CTableHeaderCell>

                          </CTableRow>
                        </>
                      )
                    })
                  }
                    <CTableRow style={{ width: '100%', background:'cyan' }}>

                      <CTableHeaderCell
                        scope="col"
                        style={{ width: '5%', textAlign: 'center' }}
                      >
                        -
                      </CTableHeaderCell>

                      <CTableHeaderCell
                        scope="col"
                        style={{ width: '5%', textAlign: 'center' }}
                      >
                        -
                      </CTableHeaderCell>

                      <CTableHeaderCell
                        scope="col"
                        style={{ width: '9%', textAlign: 'center',color:'indigo' }}
                      >
                        BILLED TONNAGE TOTAL
                      </CTableHeaderCell>

                      <CTableHeaderCell
                        scope="col"
                        style={{ width: '5%', textAlign: 'center' }}
                      >
                        {totalvaluefinder(1,singleVehicleInfo.shipment_info[0])}
                      </CTableHeaderCell>

                      <CTableHeaderCell
                        scope="col"
                        style={{ width: '5%', textAlign: 'center', color:'green' }}
                      >
                        Total
                      </CTableHeaderCell>

                      <CTableHeaderCell
                        scope="col"
                        style={{ width: '5%', textAlign: 'center' }}
                      >
                        {totalvaluefinder(2,singleVehicleInfo.shipment_info[0])}
                      </CTableHeaderCell>

                    </CTableRow>
                  </CTableBody>
                </CTable>
              </CRow>
            </>
          )
        } */}
        {idt.length > 0 && singleVehicleInfo.trip_sheet_info.purpose == 1 && singleVehicleInfo.trip_sheet_info.to_divison == 1 &&
          (
            <>
              <CRow className="mt-2" hidden>
                <CCol xs={12} md={3}>
                  <CFormLabel
                    htmlFor="inputAddress"
                    style={{
                      backgroundColor: '#4d3227',
                      margin: '15px 0',
                      color: 'white',
                    }}
                  >
                    IncoTerm wise Freight Information
                  </CFormLabel>
                </CCol>
                <CCol md={3}>
                  <CFormLabel htmlFor="dname">Freight Paid Tonnage</CFormLabel>
                  <CFormInput
                    name="dname"
                    size="sm"
                    id="dname"
                    readOnly
                    // value={`${totalvaluefinder(1,singleVehicleInfo.shipment_info[0])} / ${totalvaluefinder(3,singleVehicleInfo.shipment_info[0])}`}
                    value={totalvaluefinder(3, singleVehicleInfo.shipment_info[0])}
                  />
                </CCol>
              </CRow>
              <CRow>
                <CTable style={{ height: '40vh', width: 'auto' }} className="overflow-scroll">
                  <CTableHead style={{ backgroundColor: '#4d3227', color: 'white' }}>
                    <CTableRow style={{ width: '100%' }}>

                      <CTableHeaderCell
                        scope="col"
                        style={{ color: 'white', width: '5%', textAlign: 'center' }}
                      >
                        S.No
                      </CTableHeaderCell>

                      <CTableHeaderCell
                        scope="col"
                        style={{ color: 'white', width: '9%', textAlign: 'center' }}
                      >
                        Inco Term
                      </CTableHeaderCell>

                      <CTableHeaderCell
                        scope="col"
                        style={{ color: 'white', width: '5%', textAlign: 'center' }}
                      >
                        QTY in MTS
                      </CTableHeaderCell>

                      <CTableHeaderCell
                        scope="col"
                        style={{ color: 'white', width: '5%', textAlign: 'center' }}
                      >
                        Rate Per TON
                      </CTableHeaderCell>

                      <CTableHeaderCell
                        scope="col"
                        style={{ color: 'white', width: '5%', textAlign: 'center' }}
                      >
                        Amount
                      </CTableHeaderCell>

                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {idt.map((data, index) => {
                      console.log(data, 'rowData-data')

                      return (
                        <>
                          <CTableRow style={{ width: '100%' }}>

                            <CTableHeaderCell
                              scope="col"
                              style={{ width: '5%', textAlign: 'center' }}
                            >
                              {index + 1}
                            </CTableHeaderCell>

                            <CTableHeaderCell
                              scope="col"
                              style={{ width: '9%', textAlign: 'center' }}
                            >
                              {getIncoTermNameByCode(data.inco_term_id)}
                            </CTableHeaderCell>

                            <CTableHeaderCell
                              scope="col"
                              style={{ width: '5%', textAlign: 'center' }}
                            >
                              {Number(parseFloat(data.qty).toFixed(2))}
                            </CTableHeaderCell>

                            <CTableHeaderCell
                              scope="col"
                              style={{ width: '5%', textAlign: 'center' }}
                            >
                              {JavascriptInArrayComponent(data.inco_term_id, [381, 382]) ? 0 : values.frpt}
                            </CTableHeaderCell>

                            <CTableHeaderCell
                              scope="col"
                              style={{ width: '5%', color: `${JavascriptInArrayComponent(data.inco_term_id, [381, 382]) ? 'white' : ''}`, textAlign: 'center', background: `${JavascriptInArrayComponent(data.inco_term_id, [381, 382]) ? 'red' : ''}` }}

                            >
                              {/* {data.amount} */}
                              {Math.round(Number(parseFloat(Number(values.frpt) * Number(data.qty)).toFixed(2)))}
                            </CTableHeaderCell>

                          </CTableRow>
                        </>
                      )
                    })
                    }
                    <CTableRow style={{ width: '100%', background: 'cyan' }}>

                      <CTableHeaderCell
                        scope="col"
                        style={{ width: '5%', textAlign: 'center' }}
                      >
                        -
                      </CTableHeaderCell>

                      <CTableHeaderCell
                        scope="col"
                        style={{ width: '9%', textAlign: 'center', color: 'indigo' }}
                      >
                        BILLED TONNAGE TOTAL
                      </CTableHeaderCell>

                      <CTableHeaderCell
                        scope="col"
                        style={{ width: '5%', textAlign: 'center' }}
                      >
                        {totalvaluefinder(1, singleVehicleInfo.shipment_info[0])}
                      </CTableHeaderCell>

                      <CTableHeaderCell
                        scope="col"
                        style={{ width: '5%', textAlign: 'center', color: 'green' }}
                      >
                        Total
                      </CTableHeaderCell>

                      <CTableHeaderCell
                        scope="col"
                        style={{ width: '5%', textAlign: 'center' }}
                      >
                        {totalvaluefinder(2, singleVehicleInfo.shipment_info[0])}
                      </CTableHeaderCell>

                    </CTableRow>
                  </CTableBody>
                </CTable>
              </CRow>
            </>
          )
        }
      </CRow>
      <CRow></CRow>
      <CRow></CRow>
    </>
  )
}

export default NlmtAdvanceCreationHire
