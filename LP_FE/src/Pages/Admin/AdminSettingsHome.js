/* eslint-disable  */
import {
    CButton,
    CCard,
    CCol,
    CModal,
    CModalHeader,
    CModalTitle,
    CContainer,
    CModalBody,
    CForm,
    CAlert,
    CModalFooter,
    CFormInput,
    CFormLabel,
    CFormSelect,
    CNav,
    CNavItem,
    CNavLink,
    CRow,
    CTabContent,
    CTable,
    CTableBody,
    CTableDataCell,
    CTableHead,
    CTableHeaderCell,
    CTableRow,
    CTabPane,
    CFormFloating,
    CFormTextarea,
    CSpinner,
    CInputGroup,
    CInputGroupText,
    CCardImage,
    CTooltip,
  } from '@coreui/react'
  import React,{ useState, useEffect } from 'react'
  import { ToastContainer, toast } from 'react-toastify'
  import { json, Link, useNavigate, useParams } from 'react-router-dom'
  import Loader from 'src/components/Loader'
  import SmallLoader from 'src/components/SmallLoader'
  import DefinitionsListApi from 'src/Service/Definitions/DefinitionsListApi'
  import FIEntryService from 'src/Service/FIEntry/FIEntryService' 
  import FIEntryValidation from 'src/Utils/FIEntry/FIEntryValidation'
//   import maintenance_logo from 'src/assets/naga/main1.jpg'
  import maintenance_logo from 'src/assets/naga/main2.png'
  import useForm from 'src/Hooks/useForm' 
  import ExpenseIncomePostingDate from '../TripsheetClosure/Calculations/ExpenseIncomePostingDate'
  import AccessDeniedComponent from 'src/components/commoncomponent/AccessDeniedComponent'
  import JavascriptInArrayComponent from 'src/components/commoncomponent/JavascriptInArrayComponent'
  import * as LogisticsProScreenNumberConstants from 'src/components/constants/LogisticsProScreenNumberConstants'

  import Webcam from 'react-webcam'
  import CIcon from '@coreui/icons-react'
  import * as icon from '@coreui/icons';
  import FileResizer from 'react-image-file-resizer'

  import Swal from "sweetalert2";
  import CustomTable from 'src/components/customComponent/CustomTable'
import RakeClosureSubmissionService from 'src/Service/RakeMovement/RakeClosureSubmission/RakeClosureSubmissionService'
import RakeTripsheetSapService from 'src/Service/SAP/RakeTripsheetSapService'
import { formatDateAsDDMMYYY } from '../RakeMovement/CommonMethods/CommonMethods'
import JavascriptDateCheckComponent from 'src/components/commoncomponent/JavascriptDateCheckComponent'
import FCIClosureSubmissionService from 'src/Service/FCIMovement/FCIClosureSubmission/FCIClosureSubmissionService'
import tr from 'date-fns/esm/locale/tr/index.js'
import TripSheetSearchComponent from '../FIScreen/TripsheetSearchComponent/TripSheetSearchComponent'
import FISearchSelectComponent from '../FIScreen/FISearchSelectComponent/FISearchSelectComponent'
import DriverListSearchSelectComponent from '../FIScreen/DriverListSearchSelectComponent/DriverListSearchSelectComponent'
import AdminSettingsService from 'src/Service/AdminSettings/AdminSettingsService' 
import AdminPartialTripsheetSerachSelectComponent from './CommonMethods/AdminPartialTripsheetSerachSelectComponent'
import TripSheetCreationService from 'src/Service/TripSheetCreation/TripSheetCreationService'
import VehicleAssignmentService from 'src/Service/VehicleAssignment/VehicleAssignmentService'
import AdminInvoiceReversalShipmentSerachSelectComponent from './CommonMethods/AdminInvoiceReversalShipmentSerachSelectComponent'
import DieselVendorMasterService from 'src/Service/Master/DieselVendorMasterService'

  const AdminSettingsHome = () => {
    /*================== User Id & Location Fetch ======================*/
    const user_info_json = localStorage.getItem('user_info')
    const user_info = JSON.parse(user_info_json)
    const user_locations = []

    /* Get User Locations From Local Storage */
    user_info.location_info.map((data, index) => {
      user_locations.push(data.id)
    })

    /* Get User Id From Local Storage */
    const user_id = user_info.user_id

    // console.log(user_locations)
    /*================== User Location Fetch ======================*/

    /* ==================== Access Part Start ========================*/
  const [screenAccess, setScreenAccess] = useState(false)
  const [screenAccessRake, setScreenAccessRake] = useState(false)
  let page_no = LogisticsProScreenNumberConstants.SettingsModule.Admin_Settings
  let page_no_rake = LogisticsProScreenNumberConstants.RakeClosureModule.Rake_FIEntry

  useEffect(()=>{

    if(user_info.is_admin == 1 || JavascriptInArrayComponent(page_no,user_info.page_permissions)){
      console.log('screen-access-allowed')
      setScreenAccess(true)
    } else{
      console.log('screen-access-not-allowed')
      setScreenAccess(false)
    }

    if(user_info.is_admin == 1){
      console.log('rakeFI-screen-access-allowed')
      setScreenAccessRake(true)
    } else{
      console.log('rakeFI-screen-access-not-allowed')
      setScreenAccessRake(false)
    }

  },[])
  /* ==================== Access Part End ========================*/

 const [TripsheetNo, setTripsheetNo] = useState([])

    const formValues = {
      partial_tripsheets:'',
      vehicle_id:'',
      driver_id:'',
      parking_id:'',
      tripsheet_id:'',
      vehicle_type_id:'',
      rj_sales_id:'',
      diesel_vendor_id:'',
      hire_vendor_code:'',
      fi_entry_type:'',
      entry_to:'',
      to_division:'',
      own_income_expense:'',
      hire_income_expense:'',
      income_amount:'',
      expense_amount:'',
      payment_mode:'',
      sap_income_document_no:'',
      sap_expense_document_no:'',
      sap_diesel_document_no:'',
      sap_rj_document_no:'',
      fi_status:'',
      remarks:'',
      gltype:'',
      firemarks:'',
      fitdsremarks:'',
      rake_freight_amount:'',
      rake_supplier_ref_no:'',
      rake_supplier_posting_date:'',
      rake_gst_tax_type:'',
      rake_tds_type:'',
      rake_hsn_type:'',
    }

    const [fetch, setFetch] = useState(false)
    const [Parking_id, setParking_id] = useState('')
    const [vehId, setVehID] = useState('')
    const [vTypeId, setVtypeID] = useState('')
    const [vehNo, setVehNo] = useState('')
    const [vType, setVtype] = useState('')
    const [dId, setDID] = useState('')
    const [tsId, setTSID] = useState('')
    const [driverName, setDriverName] = useState('')
    const [driverCode, setDriverCode] = useState('')
    const [vendorCode, setVendorCode] = useState('')
    const [vendorName, setVendorName] = useState('')
    const [singleVehicleInfo, setSingleVehicleInfo] = useState(false)
    const [RJTripSheetNo, setRJTripSheetNo] = useState('')
    const [gltype, setGltype] = useState('')
    const [cost_center, setCost_center] = useState('')
    const [gl_code, setGLCode] = useState('')
    const [fjcustomer, setFJCustomer] = useState([])
    const [Diesel_vendor_code, setDiesel_Vendor_code] = useState('')
    const [Diesel_vendor_id, setDiesel_Vendor_id] = useState('')
    const [RJSONo, setRJSONo] = useState([])
    const [RJ_vendor_Code, setRJ_vendor_Code] = useState('')
    const [RJ_vendor_Name, setRJ_vendor_Name] = useState('')
    const [RJ_Sales_id, setRJ_Sales_id] = useState('')
    const [FJ_Sales_Customer_Code, setFJ_Sales_Customer_Code] = useState('')
    const [FJ_Sales_Customer_Name, setFJ_Sales_Customer_Name] = useState('')
    const [FJ_Sales_Shipment_ID, setFJ_Sales_Shipment_ID] = useState('')
    const [acceptBtn, setAcceptBtn] = useState(true)
    const [owngltypes,setOwnGltypes] = useState([])
    const [selected, setSelected] = useState(owngltypes.slice(0,2));
    const [hiregltypes,setHireGltypes] = useState([])
    const [RjCustomer, setRjCustomer] = useState(0)
    const [selectedHire, setSelectedHire] = useState(hiregltypes.slice(0,2));
    const [shedName, setShedName] = useState([])
    const [remarks, setRemarks] = useState('');
    const [driverPhoneNumberById, setDriverPhoneNumberById] = useState('')
    const [driverCodeById, setDriverCodeById] = useState('')
    const [confirmBtn, setConfirmBtn] = useState(false)
    const [rowData, setRowData] = useState([])
    const [TaxType, setTaxType] = useState([])
    const [PaymentMode, setPaymentMode] = useState([])
    const [GstTaxType, setGstTaxType] = useState([])
    const [Shipment_no, setShipment_no] = useState('')


    const REQ = () => <span className="text-danger"> * </span>

    const navigation = useNavigate()
    const [errorModal, setErrorModal] = useState(false)
    const [error, setError] = useState({})

    const { id } = useParams()
    const [state, setState] = useState({
    page_loading: false,
    })
    const {
      values,
      errors,
      handleChange, 
      handleChangeMap,
      isTouched,
      setIsTouched,
      setErrors,
      onFocus,
      handleSubmit,
      enableSubmit,
      onBlur,
      handleMultipleChange,
    } = useForm(login, FIEntryValidation, formValues)

    function login() {
      // alert('No Errors CallBack Called')
    }

const handleChangenew = event => {
const result = event.target.value.toUpperCase();

setRemarks(result);

};

/* ==================== Cash payment Access Part End ========================*/

const getRndInteger = (min, max) => {
  return Math.floor(Math.random() * (max - min)) + min;
}

  /* ==================== FI Form Image ReSize End ========================*/

  /* ==================== FI Posting Vendor ========================*/

    /* ==================== FI Single TripSheet FI Details Report Start ========================*/

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

    /* ==================== FI Single TripSheet FI Details Report End ========================*/

  /* SAP Posting Date */

  const Expense_Income_Posting_Date = ExpenseIncomePostingDate();

    // ========================================== ASK OTHERS PART START ========================================== //
     
    // ========================================== ASK PART START ========================================== //

    const [currentProcessId, setCurrentProcessId] = useState(0)
    
    const [smallfetch, setSmallFetch] = useState(false)
    const [headEnable, setHeadEnable] = useState(true)

    /* == ASKK Admin Settings Constants Part Start == */

    const [tripsheetNumber1, setTripsheetNumber1] = useState('')
    const [updatedDieselAdvAmount1, setUpdatedDieselAdvAmount1] = useState('')
    const [updatedAdvAmount1, setUpdatedAdvAmount1] = useState('')
    const [updatedFPT1, setUpdatedFPT1] = useState('')
    const [tripsheetNumber1Having, setTripsheetNumber1Having] = useState(false)
    const [tripsheetNumber1Data, setTripsheetNumber1Data] = useState({})
    const [rjPartialSettlementData,setRjPartialSettlementData] = useState([])    
    const [invoiceReversalShipmentData,setInvoiceReversalShipmentData] = useState([])    

    const [tripHirePaymentData, setTripHirePaymentData] = useState({})
    const [tripHirePaymentDataDR, setTripHirePaymentDataDR] = useState({})
    const [shipmentPossibility, setShipmentPossibility] = useState(false)
    const [shipmentPossibilityDR, setShipmentPossibilityDR] = useState(false)
    const [shipmentError, setShipmentError] = useState(false)
    const [shipmentErrorDR, setShipmentErrorDR] = useState(false)
    const [tripSheetHaving, setTripsheetHaving] = useState(false)
    const [tripSheetHavingDR, setTripsheetHavingDR] = useState(false)
    const [shipmentHaving, setShipmentHaving] = useState(false)
    const [shipmentHavingDR, setShipmentHavingDR] = useState(false)
    const [shipmentDeliveryData,setShipmentDeliveryData] = useState([])
    const [shipmentDeliveryDataDR,setShipmentDeliveryDataDR] = useState([])

    const [tripsheetNumberNew, setTripsheetNumberNew] = useState('');
    const [tripsheetNumberNewDR, setTripsheetNumberNewDR] = useState('');
    const [shipmentNumberNew, setShipmentNumberNew] = useState('');
    const [shipmentNumberNewDR, setShipmentNumberNewDR] = useState('');

    const [deliveryDelete, setDeliveryDelete] = useState('');
    const [deliveryNoToDelete, setDeliveryNoToDelete] = useState('');
    const [deliveryQty, setDeliveryQty] = useState('');

    const [tripsheetNumber6, setTripsheetNumber6] = useState('')
    const [tripsheetNumber6Having, setTripsheetNumber6Having] = useState(false)
    const [tripsheetNumber6Data, setTripsheetNumber6Data] = useState({})
    
    const [pgiUpdateModal, setPgiUpdateModal] = useState(false);
    const [pgiUpdateProcess, setPgiUpdateProcess] = useState('');
    const [deliveryNoToPgiUpdate, setDeliveryNoToPgiUpdate] = useState('');
    
    const [irShipmentHaving, setIrShipmentHaving] = useState(false)
    const [irShimentModalEnable, setIrShimentModalEnable] = useState(false)
    const [irShipmentData, setIrShipmentData] = useState({})
    const [selectedIrShipmentNumber, setSelectedIrShipmentNumber] = useState('')
    const [selectedIrShipmentId, setSelectedIrShipmentId] = useState('')

    /* == Admin Settings Constants Part End == */

    /* == Admin Settings Custom Functions Part Start == */ 

    const onChangeFilter = (event) => {
      var selected_value = event.value
      console.log(selected_value, 'selected_value')
      if (selected_value) {
        setIrShipmentHaving(true)
        setSelectedIrShipmentId(selected_value)
        invoiceReversalShipmentData.map((vv,kk)=>{ 
          if(selected_value == vv.shipment_id){
            console.log(vv, 'selected_value - IrShipmentData')
            setIrShipmentData(vv) 
            setSelectedIrShipmentNumber(vv.shipment_no)
          }
        })
      } else {
        setIrShipmentHaving(false)
        setSelectedIrShipmentNumber('') 
        setSelectedIrShipmentId('') 
        setIrShipmentData({}) 
      }
    }

    const clearirShipmentData = () => {
      setIrShipmentHaving(false)
      setSelectedIrShipmentNumber('') 
      setSelectedIrShipmentId('') 
      setIrShipmentData({})
    }

    // GET Tripsheet DETAILS FROM LP
    const gettripSheetData = (e) => {
      e.preventDefault()

      console.log(tripsheetNumberNew,'tripsheetNumberNew')
      if(/^[a-zA-Z0-9]+$/i.test(tripsheetNumberNew) && /[a-zA-Z]/.test(tripsheetNumberNew) && /[0-9]/.test(tripsheetNumberNew)){
        TripSheetCreationService.getTripsheetInfoByTripsheetNo(tripsheetNumberNew).then((res) => {
          setTripsheetHaving(true)
          setShipmentHaving(false)
          console.log(res,'getTripSettlementInfoByTripsheetNo')

          if (res.status == 200 && res.data != '') {

            let needed_data = res.data.data

            if(getInt(needed_data.vehicle_current_position) > 26 && getInt(needed_data.vehicle_current_position) != 50){
              setShipmentPossibility(false)
              setShipmentError('Expense Closure already completed. So, Shipment Cannot be inserted..')
            } else if(getInt(needed_data.tripsheet_open_status) == 2){
              setShipmentPossibility(false)
              setShipmentError('Tripsheet already closed. So, Shipment Cannot be inserted..')
            } else {
              setShipmentPossibility(true)
              setShipmentError('')
            }
            setSmallFetch(true)
            setTripHirePaymentData(needed_data)
            toast.success('Tripsheet Details Detected!')

          } else {

            setTripHirePaymentData([])
            setTripsheetHaving(false)
            setSmallFetch(true)
            if (res.status == 201 && (res.data.status == '1' ||res.data.status == '2')) {
              toast.warning(res.data.message)
            } else {
              setSmallFetch(true)
              toast.warning('Tripsheet Details cannot be detected from LP!')
            }
          }
        })
      } else {

        setTripHirePaymentData([])
        setTripsheetHaving(false)
        setSmallFetch(true)
        setShipmentHaving(false)
        toast.warning('Tripsheet Number Must Like "AB123456789"')
        return false
      }

    }

    const SSArray = ['','Shipment Created','Shipment Updated By User','Shipment Updated in SAP','Shipment Deleted','Shipment Completed']
    const DSArray = ['','Delivery Created','Delivery Deleted','Delivery PGI Completed']

    const SSFinder = (scode) => {
      let val = `${SSArray[scode]} - (${scode})`
      return val
    }

    const DSFinder = (scode) => {
      let val = `${DSArray[scode]} - (${scode})`
      return val
    }

    const shipmentExistsData = (sp,ts_data,type) => {
      let sp_data = []
      let sp_array = ts_data ? ts_data.shipment_info : []
      sp_array.map((vg,kg)=>{
        if(vg.shipment_no == sp){
          sp_data.push(vg)
        }
      })
      console.log(sp_data,'sp_data')
      console.log(type,'sp_data-type')
      let val = ''
      if(type == 1){
        val = sp_data.length > 0 && sp_data[0] ? sp_data[0].created_at : '-' 
      } else if(type == 2){
        val = sp_data.length > 0 && sp_data[0] ? (sp_data[0].billed_net_qty ? sp_data[0].billed_net_qty : sp_data[0].shipment_net_qty) : '-' 
      } else if(type == 3){
        val = sp_data.length > 0 && sp_data[0] ? sp_data[0].remarks : '-' 
      } else if(type == 4){
        val = sp_data.length > 0 && sp_data[0] ? sp_data[0].shipment_all_child_info.length : '-' 
      } else if(type == 5){
        val = sp_data.length > 0 && sp_data[0] ? (sp_data[0].shipment_pgi_status == 1 ? 'PGI Completed' : 'PGI Not Completed') : '-' 
      } else if(type == 6){
        val = sp_data.length > 0 && sp_data[0] ? SSFinder(sp_data[0].shipment_status) : '-' 
      }  
      console.log(val,'sp_data-val')
      return val
    }

    const irShipmentExistsData = (sp_data,type) => {
      console.log(sp_data,'sp_data')
      console.log(type,'sp_data-type')
      let val = ''
      if(type == 1){
        val = sp_data ? sp_data.created_at : '-' 
      } else if(type == 2){
        val = sp_data ? (sp_data.billed_net_qty ? sp_data.billed_net_qty : sp_data.shipment_net_qty) : '-' 
      } else if(type == 3){
        val = sp_data ? sp_data.remarks : '-' 
      } else if(type == 4){
        val = sp_data ? sp_data.shipment_all_child_info.length : '-' 
      } else if(type == 5){
        val = sp_data ? (sp_data.shipment_pgi_status == 1 ? 'PGI Completed' : 'PGI Not Completed') : '-' 
      } else if(type == 6){
        val = sp_data ? SSFinder(sp_data.shipment_status) : '-' 
      }  
      console.log(val,'sp_data-val')
      return val
    }

    const shipmentExists = (sp,ts_data) => {
      let spex = false
      let sp_array = ts_data ? ts_data.shipment_info : []
      sp_array.map((vg,kg)=>{
        if(vg.shipment_no == sp){
          spex = true
        }
      })
      return spex
    }

    const gettripSheetDataDR = (e) => {
      e.preventDefault()

      console.log(tripsheetNumberNewDR,'tripsheetNumberNewDR')
      if(/^[a-zA-Z0-9]+$/i.test(tripsheetNumberNewDR) && /[a-zA-Z]/.test(tripsheetNumberNewDR) && /[0-9]/.test(tripsheetNumberNewDR)){
        // TripSheetCreationService.getTripsheetInfoByTripsheetNo(tripsheetNumberNewDR).then((res) => {
          AdminSettingsService.getTripsheetNumber5Data(tripsheetNumberNewDR).then((res) => { 
          setTripsheetHavingDR(true)
          setShipmentHavingDR(false)
          console.log(res,'getTripSettlementInfoByTripsheetNo')

          if (res.status == 200 && res.data != '') {

            let needed_data = res.data.data

            if(getInt(needed_data.vehicle_current_position) > 26 && getInt(needed_data.vehicle_current_position) != 50){
              setShipmentPossibilityDR(false)
              setShipmentErrorDR('Expense Closure already completed. So, Shipment Cannot be inserted..')
            } else if(getInt(needed_data.tripsheet_open_status) == 2){
              setShipmentPossibilityDR(false)
              setShipmentErrorDR('Tripsheet already closed. So, Shipment Cannot be inserted..')
            } else {
              setShipmentPossibilityDR(true)
              setShipmentErrorDR('')
            }
            setSmallFetch(true)
            setTripHirePaymentDataDR(needed_data)
            toast.success('Tripsheet Details Detected!')

          } else {

            setTripHirePaymentDataDR([])
            setTripsheetHavingDR(false)
            setSmallFetch(true)
            if (res.status == 201 && (res.data.status == '1' ||res.data.status == '2')) {
              toast.warning(res.data.message)
            } else {
              setSmallFetch(true)
              toast.warning('Tripsheet Details cannot be detected from LP!')
            }
          }
        })
      } else {

        setTripHirePaymentDataDR([])
        setTripsheetHavingDR(false)
        setSmallFetch(true)
        setShipmentHavingDR(false)
        toast.warning('Tripsheet Number Must Like "AB123456789"')
        return false
      }

    }

    const getShipmentData = () => {

      console.log(shipmentNumberNew,'shipmentNumberNew') 
      VehicleAssignmentService.getSingleShipmentChildInfo(shipmentNumberNew).then((response) => {
        let viewData = response.data.data
        if(viewData && viewData.length > 0) {
          setSmallFetch(true)
          console.log(viewData,'getSingleShipmentChildInfo')
          toast.success('Shipment Delivery Details detected from LP')
          setShipmentDeliveryData(viewData) 
          setShipmentHaving(true)
        } else {
          setSmallFetch(true)
          toast.warning('Shipment Delivery Details cannot be detected from LP!')
          setShipmentDeliveryData([])
          setShipmentHaving(false)
        }

      })       
    }

    const getShipmentDataDR = () => {

      console.log(shipmentNumberNewDR,'shipmentNumberNewDR') 
      VehicleAssignmentService.getSingleShipmentChildInfo(shipmentNumberNewDR).then((response) => {
        let viewData = response.data.data
        if(viewData && viewData.length > 0) {
          setSmallFetch(true)
          console.log(viewData,'getSingleShipmentChildInfo')
          toast.success('Shipment Delivery Details detected from LP')
          setShipmentDeliveryDataDR(viewData) 
          setShipmentHavingDR(true)
        } else {
          setSmallFetch(true)
          toast.warning('Shipment Delivery Details cannot be detected from LP!')
          setShipmentDeliveryDataDR([])
          setShipmentHavingDR(false)
        }

      })       
    }

    const incoTermFinder = (id) => {
      let incoterm_name = '-'
      incoTermsData.map((vv,kk)=>{
        // console.log(vv,'incoTermFinder-vv')
        if(vv.definition_list_id == id){
          incoterm_name = `${vv.definition_list_name} (${vv.definition_list_code})`
        }
      })
      return incoterm_name
    }

    const handleChangetripsheetNumberNew = event => {
      let tripResult = event.target.value.toUpperCase();
      setTripsheetNumberNew(tripResult.trim());
    };

    const handleChangetripsheetNumberNewDR= event => {
      let tripResult = event.target.value.toUpperCase();
      setTripsheetNumberNewDR(tripResult.trim());
    };

    const handleChangenewtrip1 = event => {
      let tripResult = event.target.value.toUpperCase();

      let value_change = tripResult.trim().replace(/[^0-9]+/g, '')
      setShipmentNumberNew(value_change);

    };

    const handleChangenewtrip1DR = event => {
      let tripResult = event.target.value.toUpperCase();

      let value_change = tripResult.trim().replace(/[^0-9]+/g, '')
      setShipmentNumberNewDR(value_change);

    };

    const incoTermUpdateChange = (event, child_property_name, parent_index) => {
      let getData3 = event.target.value
      const shipment_delivery_parent_info = JSON.parse(JSON.stringify(shipmentDeliveryData))
      shipment_delivery_parent_info[parent_index][`${child_property_name}_input`] = getData3
      console.log(shipment_delivery_parent_info,'shipment_delivery_parent_info-updated')
      setShipmentDeliveryData(shipment_delivery_parent_info)
    }

    const incoTermUpdateValue = (original, input) => {
      return input === undefined ? original : input
    }

    const handleTripsheetNumber1 = event => {
        let tripResult = event.target.value.toUpperCase();
        setTripsheetNumber1(tripResult.trim());
    };

    const handleTripsheetNumber6 = event => {
        let tripResult = event.target.value.toUpperCase();
        setTripsheetNumber6(tripResult.trim());
    };

    const tripPurposeFinder = (id) => {
        let pp = ''
        if(id == 1) {
            return 'FG-Sales'
        } else if(id == 2) {
            return 'FG-STO'
        } else if(id == 3) {
            return 'RMSTO'
        } else if(id == 4) {
            return 'OTHERS'
        } else if(id == 5) {
            return 'FCI'
        } else {
            return pp
        } 
    }

    /* Function For Trip Division Find */
    const tripDivisionFinder = (id) => {
        if(id == 2) {
            return 'NLCD'
        } else {
            return 'NLFD'
        }
    }

    const ColoredLine = ({ color }) => (
        <hr
            style={{
                color: color,
                backgroundColor: color,
                height: 5
            }}
        />
    )

    const changesType1 = (event,type) => {
        let value1 = event.target.value
        let getData = value1.replace(/\D/g, '')
        if(type == 1){
            setUpdatedAdvAmount1(getData)
        } else if(type == 2){
            setUpdatedDieselAdvAmount1(getData)
        } else {
            setUpdatedFPT1(getData)
        } 
    }

    const [changedTrip6Purpose, setChangedTrip6Purpose] = useState('')
    const [changedTrip6Division, setChangedTrip6Division] = useState('')
    const [changedTrip6PS, setChangedTrip6PS] = useState('')
    const [changedTrip6Remarks, setChangedTrip6Remarks] = useState('')
    const changesType6 = (event,type) => {
        let value1 = event.target.value

        let getData = value1.replace(/\D/g, '')
        if(type == 4){
          getData = value1
        }
        
        if(type == 1){
            setChangedTrip6Purpose(getData)
        } else if(type == 2){
            setChangedTrip6Division(getData)
        } else if(type == 3){
            setChangedTrip6PS(getData)
        } else {
            setChangedTrip6Remarks(getData)
        } 
    }

    const diStatusFinder = (code) => {
        if(code == '1'){
            return 'DI Request Cretated'
        } else if(code == '2'){
            return 'DI Request Confirmed'
        } else if(code == '3'){
            return 'DI Request Approved'
        } else {
            return '-'
        }
    }

    // GET Trip tripsheetNumber1 DETAILS FROM LP
    const gettripsheetNumber1Data = (e) => {
        e.preventDefault() 
        console.log(tripsheetNumber1,'tripsheetNumber1')
        if(/^[a-zA-Z0-9]+$/i.test(tripsheetNumber1) && /[a-zA-Z]/.test(tripsheetNumber1) && /[0-9]/.test(tripsheetNumber1)){
            AdminSettingsService.getTripsheetNumber1Data(tripsheetNumber1).then((res) => { 
            let closure_info_id_data = res.data.data
            console.log(closure_info_id_data,'closure_info_id_data')
  
            if (res.status == 200 && res.data != '') {
                setTripsheetNumber1Having(true)
              let needed_data = res.data.data 
              setSmallFetch(true)
              setTripsheetNumber1Data(needed_data)
              setUpdatedAdvAmount1(needed_data.trip_sheet_info?.advance_amount)
              setUpdatedDieselAdvAmount1(needed_data.trip_sheet_info?.advance_payment_diesel)
              setUpdatedFPT1(needed_data.trip_sheet_info?.freight_rate_per_tone)
              toast.success('Tripsheet Details Detected!')
  
            } else if (res.status == 201 && (res.data.status == '1' || res.data.status == '2' || res.data.status == '3'|| res.data.status == '4')) {
                setSmallFetch(true)
                setTripsheetNumber1Having(false)
                toast.warning(res.data.message)             
            } else { 
                setSmallFetch(true)
                setTripsheetNumber1Having(false)
                toast.warning('Tripsheet Details cannot be detected from LP!')
            }
          })
        } else {
  
            clearValuestripsheetNumber1()
            setTripsheetNumber1Having(false)
            setSmallFetch(true)        
            toast.warning('Tripsheet Number Must Like "HD010124001"')
            return false
        }
  
    }

    // GET Trip tripsheetNumber6 DETAILS FROM LP
    const gettripsheetNumber6Data = (e) => {
        e.preventDefault() 
        console.log(tripsheetNumber6,'tripsheetNumber6')
        if(/^[a-zA-Z0-9]+$/i.test(tripsheetNumber6) && /[a-zA-Z]/.test(tripsheetNumber6) && /[0-9]/.test(tripsheetNumber6)){
            AdminSettingsService.getTripsheetNumber6Data(tripsheetNumber6).then((res) => { 
            let closure_info_id_data = res.data.data
            console.log(closure_info_id_data,'closure_info_id_data')
  
            if (res.status == 200 && res.data != '') {
                setTripsheetNumber6Having(true)
              let needed_data = res.data.data 
              setSmallFetch(true)
              setTripsheetNumber6Data(needed_data)
              setChangedTrip6PS(needed_data.parking_status)
              toast.success('Tripsheet Details Detected!')
  
            } else if (res.status == 201 && (res.data.status == '1' || res.data.status == '2' || res.data.status == '3'|| res.data.status == '4' || res.data.status == '5')) {
                setSmallFetch(true)
                setTripsheetNumber6Having(false)
                toast.warning(res.data.message)             
            } else { 
                setSmallFetch(true) 
                setTripsheetNumber6Having(false)
                toast.warning('Tripsheet Details cannot be detected from LP!')
            }
          })
        } else {
  
            clearValuestripsheetNumber6()
            setTripsheetNumber6Having(false)
            setChangedTrip6PS('')
            setSmallFetch(true)        
            toast.warning('Tripsheet Number Must Like "HD010124001"')
            return false
        }
  
    }

    const clearValuesType4  = () => { 
        setCurrentProcessId(0)
        setHeadEnable(true)
        values.partial_tripsheets = ''
    }
    const clearValuesType2  = () => { 
      setCurrentProcessId(0)
      setHeadEnable(true) 
  }
    const clearValuestripsheetNumber3  = () => { 
      setCurrentProcessId(0)
      setHeadEnable(true)
    }
    const clearValuestripsheetNumber5  = () => { 
      setCurrentProcessId(0)
      setHeadEnable(true)
    }
    const clearValuestripsheetNumber6  = () => { 
      setCurrentProcessId(0)
      setHeadEnable(true)
      setTripsheetNumber6('')
      setTripsheetNumber6Having(false)
      setTripsheetNumber6Data([])
    }
    const clearValuestripsheetNumber1  = () => { 
      setCurrentProcessId(0)
      setHeadEnable(true)
      setTripsheetNumber1('')
      setTripsheetNumber1Having(false)
      setTripsheetNumber1Data([])
      setUpdatedAdvAmount1('')
      setUpdatedDieselAdvAmount1('')
      setUpdatedFPT1('')
    }

    /* == Admin Settings Custom Functions Part End == */

    /* == Admin Settings Custom Submit Functions Part Start == */

    const changesType1Submit = () => {

        if(updatedFPT1 == '' || updatedFPT1 < 0){
            toast.warning('Updated Freight Rate Per TON Should not be empty..')
            return false
        }

        if(updatedAdvAmount1 == '' || updatedAdvAmount1 < 0){
            toast.warning('Updated Advance Amount Should not be empty..')
            return false
        }

        if(updatedDieselAdvAmount1 == '' || updatedDieselAdvAmount1 < 0){
            toast.warning('Updated Diesel Advance Amount Should not be empty..')
            return false
        }

        console.log(tripsheetNumber1,'resp-trip_sheet_no')
        console.log(tripsheetNumber1Data.parking_yard_gate_id,'resp-tripsheetNumber1Data.id')
        console.log(updatedFPT1,'resp-updatedFPT1')
        console.log(updatedAdvAmount1,'resp-updatedAdvAmount1')
        console.log(updatedDieselAdvAmount1,'resp-updatedDieselAdvAmount1')
        console.log(user_id,'resp-user_id') 

        setFetch(false)

        let lp_data = new FormData()
        lp_data.append('trip_sheet_no', tripsheetNumber1)
        lp_data.append('parking_id', tripsheetNumber1Data.parking_yard_gate_id)
        lp_data.append('freight_rate_per_tone', updatedFPT1)
        lp_data.append('advance_amount', updatedAdvAmount1)
        lp_data.append('advance_payment_diesel', updatedDieselAdvAmount1)
        lp_data.append('updated_by', user_id)

        AdminSettingsService.submitChangesType1(lp_data).then((res) => { 

            console.log(res,'submitChangesType1-response')
            setFetch(true)
            if (res.status == 200) {
                Swal.fire({
                title: 'Tripsheet Updation Completed Successfully!',
                icon: "success",
                confirmButtonText: "OK",
                }).then(function () {
                    window.location.reload(false)
                });
            } else if (res.status == 201) {
                Swal.fire({
                title: res.data.message,
                icon: "warning",
                confirmButtonText: "OK",
                }).then(function () {
                    // window.location.reload(false)
                })
            } else {
                toast.warning('Tripsheet Updation Failed. Kindly contact Admin..!')
            }

        })
    }

    const changesType6Submit = () => {
       
        console.log(tripsheetNumber6,'resp-trip_sheet_no')
        console.log(tripsheetNumber6Data.parking_yard_gate_id,'resp-tripsheetNumber1Data.id')
        console.log(tripsheetNumber6Data.vehicle_id,'resp-tripsheetNumber1Data.id')
        console.log(changedTrip6Division,'resp-changedTrip6Division')
        console.log(changedTrip6PS,'resp-changedTrip6PS')
        console.log(changedTrip6Purpose,'resp-changedTrip6Purpose')
        console.log(changedTrip6Remarks,'resp-changedTrip6Remarks')
        console.log(user_id,'resp-user_id') 

        // return false
        setFetch(false)

        let lp_data = new FormData()
        lp_data.append('trip_sheet_no', tripsheetNumber6)
        lp_data.append('parking_id', tripsheetNumber6Data.parking_yard_gate_id)
        lp_data.append('purpose', changedTrip6Purpose ? changedTrip6Purpose : (tripsheetNumber6Data.trip_sheet_info && tripsheetNumber6Data.trip_sheet_info.purpose ? tripsheetNumber6Data.trip_sheet_info.purpose : ''))
        lp_data.append('parking_status', changedTrip6PS ? changedTrip6PS : tripsheetNumber6Data.parking_status)
        lp_data.append('to_divison', changedTrip6Division ? changedTrip6Division : (tripsheetNumber6Data.trip_sheet_info && tripsheetNumber6Data.trip_sheet_info.to_divison ? tripsheetNumber6Data.trip_sheet_info.to_divison : ''))
        lp_data.append('remarks', changedTrip6Remarks ? changedTrip6Remarks : (tripsheetNumber6Data.trip_sheet_info && tripsheetNumber6Data.trip_sheet_info.remarks ? tripsheetNumber6Data.trip_sheet_info.remarks : ''))
        lp_data.append('updated_by', user_id)

        AdminSettingsService.submitChangesType7(lp_data).then((res) => { 

            console.log(res,'submitChangesType7-response')
            setFetch(true)
            if (res.status == 200) {
                Swal.fire({
                title: 'Tripsheet Updation Completed Successfully!',
                icon: "success",
                confirmButtonText: "OK",
                }).then(function () {
                    window.location.reload(false)
                });
            } else if (res.status == 201) {
                Swal.fire({
                title: res.data.message,
                icon: "warning",
                confirmButtonText: "OK",
                }).then(function () {
                    // window.location.reload(false)
                })
            } else {
                toast.warning('Tripsheet Updation Failed. Kindly contact Admin..!')
            }

        })
    }

    const reverseShipmentInvoice = () => {

      let lp_data = new FormData()
      lp_data.append('parking_id', irShipmentData.parking_id)
      lp_data.append('tripsheet_id', irShipmentData.tripsheet_id)
      lp_data.append('shipment_id', selectedIrShipmentId)
      lp_data.append('shipment_no', selectedIrShipmentNumber) 
      lp_data.append('updated_by', user_id)

      setFetch(false)
      AdminSettingsService.submitChangesType2(lp_data).then((res) => { 

        console.log(res,'submitChangesType2-response')
        setFetch(true)
        if (res.status == 200) {
          Swal.fire({
          title: 'Shipment Invoice Reversal Completed Successfully!',
          icon: "success",
          confirmButtonText: "OK",
          }).then(function () {
              window.location.reload(false)
          });
        } else if (res.status == 201) {
          Swal.fire({
          title: res.data.message,
          icon: "warning",
          confirmButtonText: "OK",
          }).then(function () {
              // window.location.reload(false)
          })
        } else {
          toast.warning('Shipment Invoice Reversal Failed. Kindly contact Admin..!')
        }

    })

    }

    const shipmentIncoTermUpdateValidation = () => {

      console.log(shipmentDeliveryData,'shipmentIncoTermUpdateValidation')
      let validation_needed = 0
      shipmentDeliveryData.map((vb,kb)=>{
        if(vb.inco_term_id_input && vb.inco_term_id_input == '0'){
          validation_needed = 1
        }
      })

      if(validation_needed == 1){
        toast.warning("One of the Delivery's Inco-Term was not selected. Kindly check and update..")
        return false
      }  

      let formdata = new FormData()
      let updated_lp_del_data = JSON.stringify(shipmentDeliveryData)
      formdata.append('updated_shipment_delivery_data', updated_lp_del_data)
      formdata.append('updated_by', user_id)
      setFetch(false)
      AdminSettingsService.submitChangesType3(formdata).then((res) => { 
        console.log(res,'submitChangesType3-response')
        setFetch(true)
        if (res.status == 200) {
          Swal.fire({
          title: 'Inco-Term Updation Completed Successfully!',
          icon: "success",
          confirmButtonText: "OK",
          }).then(function () {
              window.location.reload(false)
          });
        } else if (res.status == 201) {
          Swal.fire({
          title: res.data.message,
          icon: "warning",
          confirmButtonText: "OK",
          }).then(function () {
              // window.location.reload(false)
          })
        } else {
          toast.warning('Inco-Term Updation Failed. Kindly contact Admin..!')
        }

      })

    }

    const partial_tripsheet_update = () => {
      console.log(values.partial_tripsheets,'partial_tripsheet_update')
      
      if(values.partial_tripsheets == '' || values.partial_tripsheets.length < 0){
        toast.warning('Please Select The Tripsheets..')
        return false
      }

      let formdata = new FormData()
      formdata.append('partial_tripsheets', values.partial_tripsheets)
      formdata.append('updated_by', user_id)
      setFetch(false)
      AdminSettingsService.submitChangesType4(formdata).then((res) => { 
        console.log(res,'submitChangesType4-response')
        setFetch(true)
        if (res.status == 200) {
          Swal.fire({
          title: 'Tripsheet Updation Completed Successfully!',
          icon: "success",
          confirmButtonText: "OK",
          }).then(function () {
              window.location.reload(false)
          });
        } else if (res.status == 201) {
          Swal.fire({
          title: res.data.message,
          icon: "warning",
          confirmButtonText: "OK",
          }).then(function () {
              // window.location.reload(false)
          })
        } else {
          toast.warning('Tripsheet Updation Failed. Kindly contact Admin..!')
        }
      })
    }

    const deleteDelivery = () => {
      let formdata = new FormData() 
      formdata.append('shipment_no', shipmentNumberNewDR)
      formdata.append('delivery_no', deliveryNoToDelete)
      formdata.append('trip_sheet_no', tripsheetNumberNewDR)
      formdata.append('parking_id', tripHirePaymentDataDR.parking_yard_gate_id)
      formdata.append('updated_by', user_id) 

      if(tripsheetNumberNewDR == ''){
        toast.warning("Invalid Tripsheet. Kindly check and update..")
        return false
      } 

      if(shipmentNumberNewDR == ''){
        toast.warning("Invalid Shipment. Kindly check and update..")
        return false
      } 

      if(deliveryNoToDelete == ''){
        toast.warning("Invalid Delivery. Kindly check and update..")
        return false
      } 

      AdminSettingsService.submitChangesType5(formdata).then((res) => { 
        console.log(res,'submitChangesType5-response')
        setFetch(true)
        if (res.status == 200) {
          Swal.fire({
          title: 'Delivery Removal Completed Successfully!',
          icon: "success",
          confirmButtonText: "OK",
          }).then(function () {
              window.location.reload(false)
          });
        } else if (res.status == 201) {
          Swal.fire({
          title: res.data.message,
          icon: "warning",
          confirmButtonText: "OK",
          }).then(function () {
              // window.location.reload(false)
          })
        } else {
          toast.warning('Delivery Removal Failed. Kindly contact Admin..!')
        }

      })
    }

    const pgiUpdateDelivery = () => {
      let formdata = new FormData() 
      formdata.append('shipment_no', shipmentNumberNewDR)
      formdata.append('delivery_no', deliveryNoToPgiUpdate)
      formdata.append('update_process', pgiUpdateProcess) /* 1 - PGI Confirm, 2 - PGI Reversal */
      formdata.append('trip_sheet_no', tripsheetNumberNewDR)
      formdata.append('parking_id', tripHirePaymentDataDR.parking_yard_gate_id)
      formdata.append('updated_by', user_id) 

      if(tripsheetNumberNewDR == ''){
        toast.warning("Invalid Tripsheet. Kindly check and update..")
        return false
      } 

      if(shipmentNumberNewDR == ''){
        toast.warning("Invalid Shipment. Kindly check and update..")
        return false
      } 

      if(deliveryNoToPgiUpdate == ''){
        toast.warning("Invalid Delivery. Kindly check and update..")
        return false
      } 

      AdminSettingsService.submitChangesType6(formdata).then((res) => { 
        console.log(res,'submitChangesType6-response')
        setFetch(true)
        if (res.status == 200) {
          Swal.fire({
          title: 'Delivery PGI Update Completed Successfully!',
          icon: "success",
          confirmButtonText: "OK",
          }).then(function () {
              window.location.reload(false)
          });
        } else if (res.status == 201) {
          Swal.fire({
          title: res.data.message,
          icon: "warning",
          confirmButtonText: "OK",
          }).then(function () {
              // window.location.reload(false)
          })
        } else {
          toast.warning('Delivery PGI Update Failed. Kindly contact Admin..!')
        }

      })
    }

    /* == Admin Settings Custom Submit Functions Part End == */

    const assignValues = (id) => {
      console.log(id,'assignValues-id')
      if(id !=0){
        setHeadEnable(false)
      }
      setCurrentProcessId(id)
    }

    const border = {
      borderColor: '#b1b7c1',
      cursor: 'pointer'
    }

    const RakeFI_Array = ['','Expense Credit','Expense Debit','Income Credit','Income Debit']
    const RakePlant_Array = []
    RakePlant_Array['R1'] = 'Dindigul'
    RakePlant_Array['R2'] = 'Aruppukottai'

    const getInt = (val) => {
      let int_value = 0
      if(val){
        int_value = Number(parseFloat(val).toFixed(2))
      }
      console.log(int_value,'int_value')
      return int_value
    }

    const [gstTaxTermsData, setGstTaxTermsData] = useState([])
    const [incoTermsData, setIncoTermsData] = useState([])
    const [dvData, setDvData] = useState([])

    useEffect(() => {

      /* section for getting Inco Term List from database */
      DefinitionsListApi.visibleDefinitionsListByDefinition(16).then((response) => {
        setFetch(true)
        setSmallFetch(true)
        console.log(response.data.data,'setGstTaxTermsData')
        setIncoTermsData(response.data.data)
      })

      AdminSettingsService.getPartialSettlementTripsheetsData().then((resd)=>{
        let da = resd.data.data
        console.log(da,'getPartialSettlementTripsheetsData') 
        setRjPartialSettlementData(da)
      }) 

      AdminSettingsService.getInvoiceReversalShipmentsData().then((resd)=>{
        let da = resd.data.data
        console.log(da,'getInvoiceReversalShipmentsData') 
        setInvoiceReversalShipmentData(da)
      })

      DieselVendorMasterService.getDieselVendors().then((response) => {
        let viewData = response.data.data
        console.log(viewData,'getDieselVendors')
        setDvData(viewData)
      })

    }, [])

    const dieselVendorFinder = (vendor_code) => {

      console.log(dvData,'dieselVendorFinder-dvData')
      console.log(vendor_code,'dieselVendorFinder-vendor_code')
      let vendorName = '-'
      for (let i = 0; i < dvData.length; i++) {
        if (dvData[i].vendor_code == vendor_code) {
          vendorName = dvData[i].diesel_vendor_name
        }
      }
      console.log(vendorName,'dieselVendorFinder-vendorName')
      return vendorName
    }

    const tdsTaxCodeName = (code) => {
      let tds_tax_code_name = '-'

      gstTaxTermsData.map((val, key) => {
        if (val.definition_list_code == code) {
          tds_tax_code_name = val.definition_list_name
        }
      })

      console.log(tds_tax_code_name,'tds_tax_code_name')

      return tds_tax_code_name
    }

    const freightAmountUpdate = (e,type) => {
      let getData = e.target.value
      console.log(getData, 'getData')

      var floatValues =  /[+-]?([0-9]*[.])?[0-9]+/;

      if (getData.match(floatValues) && !isNaN(getData)) {
        //
        console.log('getData2')
      } else {
        console.log('getData3')
        getData = e.target.value.replace(/\D/g, '')
      }

      if(type == 2) {
        setRakeFreightAMount2(getData)
        setRakeFreightAMount1('')
      } else {
        setRakeFreightAMount1(getData)
        setRakeFreightAMount2('')
      }

    }

    const freightAmountUpdateFci = (e,type) => {
      let getData = e.target.value
      console.log(getData, 'getData')

      var floatValues =  /[+-]?([0-9]*[.])?[0-9]+/;

      if (getData.match(floatValues) && !isNaN(getData)) {
        //
        console.log('getData2')
      } else {
        console.log('getData3')
        getData = e.target.value.replace(/\D/g, '')
      }

      if(type == 2) {
        setFciFreightAMount2(getData)
        // setRakeFreightAMount1('')
      } else {
        // setRakeFreightAMount1(getData)
        setFciFreightAMount2('')
      }

    }

    const fi_entry_array = ['','EXPENSE','EXPENSE','INCOME','INCOME']
    const fi_mode_array = ['','CREDIT','DEBIT','CREDIT','DEBIT']
    const fi_tds_array = ['','YES','NO']
    const processArray = [7,8,9,10]

    // ========================================== ASK PART END ========================================== //

    return (
      <>
        {!fetch && <Loader />}
        {fetch && (
          <>
          {(screenAccess) ? (
           <>
            <CCard>
              {/* <CContainer className="mt-2"> */}

              {/* </CContainer> */}
              <CTabContent>
                {headEnable && (
                  <CRow className="mt-3">
                    <CCol xs={12} md={6}>
                      <div className="p-3">
                        <CInputGroup className="mb-3">
                          <CInputGroupText component="label" htmlFor="inputGroupSelect01">
                            FI Entry Type
                          </CInputGroupText>

                          <CFormSelect
                            id="inputGroupSelect01"
                            onchange
                            onChange={(e) => {
                              assignValues(e.target.value)
                            }}
                            value={currentProcessId}
                          >
                            <option value={0}>Select...</option>

                            {screenAccess && (<option value={1}> Tripsheet Diesel / Advance Amount Edit</option>)}
                            {screenAccess && (<option value={2}> Shipment Invoice Reversal</option>)}
                            {screenAccess && (<option value={3}> Delivery Inco - Term Change</option>)}
                            {screenAccess && (<option value={4}> RJ Invoice Updation For FI Entry</option>)}
                            {screenAccess && (<option value={5}> FG-Sales Delivery Update</option>)}
                            {screenAccess && (<option value={6}> Trip Purpose / Division Change</option>)}

                          </CFormSelect>
                        </CInputGroup>
                      </div>
                    </CCol>
                  </CRow>
                )}                
                <CTabPane role="tabpanel" aria-labelledby="home-tab" visible={JavascriptInArrayComponent(currentProcessId,processArray)}>
                     
                    <div className="card mt-3" style={{backgroundColor:"dimgrey", margin:"5%"}} >
                        <img style={{ margin: '5% 25%', borderRadius: '10%', width:"40%" }} src={maintenance_logo} />
                    </div>                               
                     
                    <CRow>
                        <CCol>
                            <CButton 
                                size="sm" 
                                color="primary" 
                                className="text-white m-4" 
                                onClick={clearValuestripsheetNumber1} 
                                type="button"
                            >
                                Previous
                            </CButton>
                        </CCol>
                    </CRow>
                </CTabPane>
               
                {/* 1 - Tripsheet Diesel / Advance Amount Edit */}
                <CTabPane role="tabpanel" aria-labelledby="home-tab" visible={currentProcessId == 1}>
                    <>  
                        {!tripsheetNumber1Having && (                     
                            <CRow>
                                <CCol xs={12} md={4}>
                                    <div className="w-100 p-3">
                                    <CFormLabel htmlFor="tripsheetNumber1">
                                        Enter Tripsheet Number
                                        <REQ />{' '}

                                    </CFormLabel>
                                    <CInputGroup>
                                        <CFormInput
                                          size="sm"
                                          name="tripsheetNumber1"
                                          id="tripsheetNumber1"
                                          maxLength={15}
                                          autoComplete='off'
                                          value={tripsheetNumber1}
                                          onChange={handleTripsheetNumber1}
                                        />
                                        <CInputGroupText className="p-0">
                                        <CButton
                                            size="sm"
                                            color="primary"
                                            onClick={(e) => { 
                                                setSmallFetch(false)
                                                gettripsheetNumber1Data(e)
                                            }}
                                        >
                                            <i className="fa fa-search px-1"></i>
                                        </CButton>
                                        <CButton
                                            size="sm"
                                            style={{ marginLeft:"3px" }}
                                            color="primary"
                                            onClick={() => {
                                            window.location.reload(false)
                                            }}
                                        >
                                            <i className="fa fa-refresh px-1"></i>
                                        </CButton>
                                        </CInputGroupText>
                                    </CInputGroup>
                                    </div>
                                </CCol>
                            </CRow>
                        )} 
                        {!smallfetch && <SmallLoader />}
                        {smallfetch && Object.keys(tripsheetNumber1Data).length != 0  && (
                            <>
                                <CCard style={{display: tripsheetNumber1Having ? 'block' : 'none'}}  className="p-3">
                                    <CRow className="mt-2" hidden>
                                        <CCol xs={12} md={3}>
                                            <CFormLabel
                                                htmlFor="inputAddress"
                                                style={{
                                                    backgroundColor: '#4d3227',
                                                    color: 'white',
                                                }}
                                            >
                                                Tripsheet Info
                                            </CFormLabel>
                                        </CCol>
                                    </CRow>
                                    <CRow>
                                        <CCol xs={12} md={2}>
                                            <CFormLabel htmlFor="dName">Tripsheet Number</CFormLabel>
                                            <CFormInput 
                                                size="sm" 
                                                id="dName" 
                                                value={tripsheetNumber1Data.trip_sheet_info?.trip_sheet_no} readOnly 
                                            />
                                        </CCol>
                                        <CCol xs={12} md={2}>
                                            <CFormLabel htmlFor="dName">Vehicle Number</CFormLabel>
                                            <CFormInput 
                                                size="sm" 
                                                id="dName" 
                                                value={tripsheetNumber1Data.vehicle_number} readOnly 
                                            />
                                        </CCol>
                                        <CCol xs={12} md={2}>
                                            <CFormLabel htmlFor="dName">Vehicle Capacity in MTS</CFormLabel>
                                            <CFormInput 
                                                size="sm" 
                                                id="dName" 
                                                value={tripsheetNumber1Data.vehicle_capacity_id?.capacity} readOnly 
                                            />
                                        </CCol>
                                        <CCol xs={12} md={2}>
                                            <CFormLabel htmlFor="dName">Division</CFormLabel>
                                            <CFormInput 
                                                size="sm" 
                                                id="dName" 
                                                value={tripDivisionFinder(tripsheetNumber1Data.trip_sheet_info?.to_divison)} readOnly 
                                            />
                                        </CCol>
                                        <CCol xs={12} md={2}>
                                            <CFormLabel htmlFor="dName">Purpose</CFormLabel>
                                            <CFormInput 
                                                size="sm" 
                                                id="dName" 
                                                value={tripPurposeFinder(tripsheetNumber1Data.trip_sheet_info?.purpose)} readOnly  
                                            />
                                        </CCol>
                                        <CCol xs={12} md={2}>
                                            <CFormLabel htmlFor="dName">Freight Rate Per TON</CFormLabel>
                                            <CFormInput 
                                                size="sm" 
                                                id="dName" 
                                                value={tripsheetNumber1Data.trip_sheet_info?.freight_rate_per_tone} readOnly 
                                            />
                                        </CCol>
                                        
                                        <CCol xs={12} md={2}>
                                            <CFormLabel htmlFor="dName">Advance Amount</CFormLabel>
                                            <CFormInput 
                                                size="sm" 
                                                id="dName" 
                                                value={tripsheetNumber1Data.trip_sheet_info?.advance_amount} readOnly 
                                            />
                                        </CCol>
                                        <CCol xs={12} md={2}>
                                            <CFormLabel htmlFor="dName">Diesel Advance Amount</CFormLabel>
                                            <CFormInput 
                                                size="sm" 
                                                id="dName" 
                                                value={tripsheetNumber1Data.trip_sheet_info?.advance_payment_diesel} readOnly 
                                            />
                                        </CCol>
                                        
                                        {(tripsheetNumber1Data.advance_payment_info  || tripsheetNumber1Data.diesel_intent_info) ? (
                                            <CCol className="mt-3" xs={12} md={6}>
                                                <span style={{ color: 'red' }}>
                                                    *Either Advance or DI process already completed. So, can't edit advance amount..
                                                </span>
                                            </CCol>
                                        ) : (
                                            <>
                                                <CCol xs={12} md={2}>
                                                    <CFormLabel htmlFor="updatedFPT1">
                                                        Updated Freight Per TON
                                                    </CFormLabel>
                                                    <CFormInput 
                                                        id="updatedFPT1" 
                                                        name="updatedFPT1" 
                                                        value={updatedFPT1}
                                                        size='sm'
                                                        maxLength={4}
                                                        onChange={(e) => {
                                                            changesType1(e,3)
                                                        }}  
                                                    />
                                                </CCol>
                                                <CCol xs={12} md={2}>
                                                    <CFormLabel htmlFor="updatedAdvAmount1">
                                                        Updated Advance
                                                    </CFormLabel>
                                                    <CFormInput 
                                                        id="updatedAdvAmount1" 
                                                        name="updatedAdvAmount1" 
                                                        value={updatedAdvAmount1}
                                                        size='sm'
                                                        maxLength={5}
                                                        onChange={(e) => {
                                                            changesType1(e,1)
                                                        }}  
                                                    />
                                                </CCol>
                                                <CCol xs={12} md={2}>
                                                    <CFormLabel htmlFor="updatedDieselAdvAmount1">Updated Diesel Advance</CFormLabel>
                                                    <CFormInput 
                                                        size="sm" 
                                                        maxLength={5}
                                                        id="updatedDieselAdvAmount1" 
                                                        name="updatedDieselAdvAmount1" 
                                                        value={updatedDieselAdvAmount1}
                                                        onChange={(e) => {
                                                            changesType1(e,2)
                                                        }}                                                         
                                                    />
                                                </CCol>
                                                <CCol className="mt-4" xs={12} md={2} style={{ display: 'flex', justifyContent: 'end' }}>
                                                    <CButton
                                                        size="sm"
                                                        color="warning" 
                                                        className="mx-3 px-3 text-white" 
                                                        onClick={() => {
                                                            changesType1Submit()
                                                        }}
                                                    >
                                                        Submit
                                                    </CButton>
                                                </CCol>
                                            </>
                                        )}                                      
                                        
                                    </CRow>
                                    <ColoredLine color="red" />
                                    {tripsheetNumber1Data.advance_payment_info && (
                                        <>
                                            <CRow className="mt-2" hidden>
                                                <CCol xs={12} md={3}>
                                                    <CFormLabel
                                                        htmlFor="inputAddress"
                                                        style={{
                                                            backgroundColor: '#4d3227',
                                                            color: 'white',
                                                        }}
                                                    >
                                                        Advance Payment Info
                                                    </CFormLabel>
                                                </CCol>
                                            </CRow>
                                            <CRow>
                                                <CCol xs={12} md={3}>
                                                    <CFormLabel htmlFor="dName">Vendor Name</CFormLabel>
                                                    <CFormInput 
                                                        size="sm" 
                                                        id="dName" 
                                                        value={tripsheetNumber1Data.advance_payment_info.advance_vendor_info?.owner_name} readOnly 
                                                    />
                                                </CCol>
                                                <CCol xs={12} md={3}>
                                                    <CFormLabel htmlFor="dName">Vendor Code</CFormLabel>
                                                    <CFormInput 
                                                        size="sm" 
                                                        id="dName" 
                                                        value={tripsheetNumber1Data.advance_payment_info?.vendor_code} readOnly 
                                                    />
                                                </CCol>                                                
                                                <CCol xs={12} md={3}>
                                                    <CFormLabel htmlFor="dName">Advance Payment Amount</CFormLabel>
                                                    <CFormInput 
                                                        size="sm" 
                                                        id="dName" 
                                                        value={tripsheetNumber1Data.advance_payment_info?.advance_payment} readOnly 
                                                    />
                                                </CCol>
                                                <CCol xs={12} md={3}>
                                                    <CFormLabel htmlFor="dName">SAP Advance Payment Doc. No.</CFormLabel>
                                                    <CFormInput 
                                                        size="sm" 
                                                        id="dName" 
                                                        value={tripsheetNumber1Data.advance_payment_info.sap_bank_payment_document_no ? tripsheetNumber1Data.advance_payment_info.sap_bank_payment_document_no :'-'} 
                                                        readOnly 
                                                    />
                                                </CCol>
                                                <CCol xs={12} md={3}>
                                                    <CFormLabel htmlFor="dName">Diesel Advance Amount</CFormLabel>
                                                    <CFormInput 
                                                        size="sm" 
                                                        id="dName" 
                                                        value={tripsheetNumber1Data.advance_payment_info?.advance_payment_diesel} readOnly 
                                                    />
                                                </CCol>
                                                <CCol xs={12} md={3}>
                                                    <CFormLabel htmlFor="dName">SAP Diesel Advance Doc. No.</CFormLabel>
                                                    <CFormInput 
                                                        size="sm" 
                                                        id="dName" 
                                                        value={tripsheetNumber1Data.advance_payment_info.sap_diesel_payment_document_no ? tripsheetNumber1Data.advance_payment_info.sap_diesel_payment_document_no : '-'} readOnly 
                                                    />
                                                </CCol>
                                                <CCol xs={12} md={3}>
                                                    <CFormLabel htmlFor="dName">Total Freight</CFormLabel>
                                                    <CFormInput 
                                                        size="sm" 
                                                        id="dName" 
                                                        value={tripsheetNumber1Data.advance_payment_info?.actual_freight} readOnly 
                                                    />
                                                </CCol>
                                                <CCol xs={12} md={3}>
                                                    <CFormLabel htmlFor="dName">SAP Freight Doc. No.</CFormLabel>
                                                    <CFormInput 
                                                        size="sm" 
                                                        id="dName" 
                                                        value={tripsheetNumber1Data.advance_payment_info.sap_freight_payment_document_no} readOnly 
                                                    />
                                                </CCol>
                                            </CRow>
                                            <ColoredLine color="red" />
                                        </>
                                    )}
                                    {tripsheetNumber1Data.diesel_intent_info && (
                                        <>
                                            <CRow className="mt-2" hidden>
                                                <CCol xs={12} md={3}>
                                                    <CFormLabel
                                                        htmlFor="inputAddress"
                                                        style={{
                                                            backgroundColor: '#4d3227',
                                                            color: 'white',
                                                        }}
                                                    >
                                                        Diesel Indent Info
                                                    </CFormLabel>
                                                </CCol>
                                            </CRow>
                                            <CRow>
                                                <CCol xs={12} md={3}>
                                                    <CFormLabel htmlFor="dName">Diesel Vendor Name</CFormLabel>
                                                    <CFormInput 
                                                        size="sm" 
                                                        id="dName" 
                                                        // value={tripsheetNumber1Data.diesel_intent_info.vendor_code == 225831 ? 'RNS Fuel Station' : 'RS Petroleum'} 
                                                        value={dieselVendorFinder(tripsheetNumber1Data.diesel_intent_info.vendor_code)} 
                                                        readOnly  
                                                    />
                                                </CCol>
                                                <CCol xs={12} md={3}>
                                                    <CFormLabel htmlFor="dName">Diesel Vendor Code</CFormLabel>
                                                    <CFormInput 
                                                        size="sm" 
                                                        id="dName" 
                                                        value={tripsheetNumber1Data.diesel_intent_info.vendor_code} readOnly  
                                                    />
                                                </CCol>
                                                <CCol xs={12} md={3}>
                                                    <CFormLabel htmlFor="dName">Diesel Screen Status</CFormLabel>
                                                    <CFormInput 
                                                        size="sm" 
                                                        id="dName" 
                                                        value={diStatusFinder(tripsheetNumber1Data.diesel_intent_info.diesel_status)} readOnly  
                                                    />
                                                </CCol>
                                                <CCol xs={12} md={3}>
                                                    <CFormLabel htmlFor="dName">Diesel Quantity in Ltr</CFormLabel>
                                                    <CFormInput 
                                                        size="sm" 
                                                        id="dName" 
                                                        value={tripsheetNumber1Data.diesel_intent_info.no_of_ltrs} readOnly  
                                                    />
                                                </CCol>
                                                <CCol xs={12} md={3}>
                                                    <CFormLabel htmlFor="dName">Diesel Amount</CFormLabel>
                                                    <CFormInput 
                                                        size="sm" 
                                                        id="dName" 
                                                        value={tripsheetNumber1Data.diesel_intent_info.total_amount} readOnly  
                                                    />
                                                </CCol>
                                                <CCol xs={12} md={3}>
                                                    <CFormLabel htmlFor="dName">Diesel Amount SAP Doc. No.</CFormLabel>
                                                    <CFormInput 
                                                        size="sm" 
                                                        id="dName" 
                                                        value={tripsheetNumber1Data.diesel_intent_info.diesel_vendor_sap_invoice_no} readOnly  
                                                    />
                                                </CCol>
                                            </CRow>
                                            <ColoredLine color="red" />
                                        </>
                                    )}
                                    
                                </CCard>
                            </>
                        )}
                        <CRow>
                            <CCol>
                                <CButton 
                                    size="sm" 
                                    color="primary" 
                                    className="text-white m-4" 
                                    onClick={clearValuestripsheetNumber1} 
                                    type="button"
                                >
                                    Previous
                                </CButton>
                            </CCol>
                        </CRow>
                         
                    </>
                </CTabPane>

                {/* 2 - Shipment Invoice Reversal */}
                <CTabPane role="tabpanel" aria-labelledby="home-tab" visible={currentProcessId == 2}>
                  <>
                  {!irShipmentHaving ? (
                    <>
                      <CRow className="m-2"> 
                        <CCol xs={12} md={4}>
                          <CFormLabel htmlFor="vCap">Shipment Number</CFormLabel>
                          <AdminInvoiceReversalShipmentSerachSelectComponent
                            size="sm"
                            className="mb-2"
                            onChange={(e) => {
                              onChangeFilter(e)
                              {
                                handleChange
                              }
                            }}
                            label="Select Shipment Number"
                            noOptionsMessage="Shipment Not found" 
                            search_type={'shipment_master'}
                            search_data={invoiceReversalShipmentData}
                          />                         
                        </CCol>
                      </CRow>
                      <CRow className="mt-md-3">
                        <CCol className="" xs={12} sm={12} md={3}>
                          <CButton 
                            size="sm" 
                            color="primary" 
                            className="text-white m-4" 
                            onClick={clearValuesType2} 
                            type="button"
                          >
                            Previous
                          </CButton>
                        </CCol>
                      </CRow>
                    </>
                  ) : (
                    <>
                      {smallfetch && Object.keys(irShipmentData).length != 0  && (
                        <>
                          <CCard className="p-3">
                            <CRow className="mt-2 mb-2" hidden>
                              <CCol xs={12} md={6}>
                                <CFormLabel
                                  htmlFor="inputAddress"
                                  style={{
                                    backgroundColor: '#4d3227',
                                    color: 'white',
                                  }}
                                >
                                  {`Trip Information : `}
                                </CFormLabel>
                              </CCol>
                            </CRow>
                            <CRow>
                              <CCol xs={12} md={3}>
                                <CFormLabel htmlFor="vNum">Vehicle Number</CFormLabel>

                                <CFormInput size="sm" id="vNum" value={irShipmentData.vehicle_number} readOnly />
                              </CCol>
                              <CCol xs={12} md={3}>
                                <CFormLabel htmlFor="vCap">Vehicle Capacity in MTS</CFormLabel>

                                <CFormInput
                                  size="sm"
                                  id="vCap"
                                  value={
                                    irShipmentData.vehicle_capacity_id_info ? irShipmentData.vehicle_capacity_id_info.capacity : ''
                                  }
                                  readOnly
                                />
                              </CCol>

                              <CCol xs={12} md={3}>
                                <CFormLabel htmlFor="vType">Vehicle Type</CFormLabel>

                                <CFormInput
                                  size="sm"
                                  id="vType"
                                  value={irShipmentData.vehicle_type_id_info ? irShipmentData.vehicle_type_id_info.type : ''}
                                  readOnly
                                />
                              </CCol>
                              <CCol xs={12} md={3}>
                                <CFormLabel htmlFor="dName">Driver Name</CFormLabel>

                                <CFormInput size="sm" id="dName" value={irShipmentData.driver_name} readOnly />
                              </CCol>
                              <CCol xs={12} md={3}>
                                <CFormLabel htmlFor="dMob">Driver Cell Number</CFormLabel>

                                <CFormInput
                                  size="sm"
                                  id="dMob"
                                  value={irShipmentData.driver_number}
                                  readOnly
                                />
                              </CCol>
                              <CCol xs={12} md={3}>
                                <CFormLabel htmlFor="tNum">Tripsheet Number</CFormLabel>
                                <CFormInput
                                  size="sm"
                                  id="tNum"
                                  value={
                                    irShipmentData.trip_sheet_info ? irShipmentData.trip_sheet_info.trip_sheet_no : ''
                                  }
                                  readOnly
                                />
                              </CCol>
                              <CCol xs={12} md={3}>
                                <CFormLabel htmlFor="vtf">Trip Purpose / Division</CFormLabel>

                                <CFormInput
                                  size="sm"
                                  id="vtf"
                                  value={`${irShipmentData.trip_sheet_info
                                      ? irShipmentData.trip_sheet_info.purpose == 1
                                        ? 'FG-SALES'
                                        : irShipmentData.trip_sheet_info.purpose == 2
                                        ? 'FG-STO'
                                        : irShipmentData.trip_sheet_info.purpose == 3
                                        ? 'RM-STO'
                                        : irShipmentData.trip_sheet_info.purpose == 4
                                        ? 'OTHERS'
                                        : irShipmentData.trip_sheet_info.purpose == 5
                                        ? 'FCI'
                                        : (irShipmentData.vehicle_type_id_info && irShipmentData.vehicle_type_id_info.id == 4 ? 'Party : FG-SALES': '')
                                      : ''} / ${irShipmentData.trip_sheet_info
                                        ? irShipmentData.trip_sheet_info.to_divison == 2
                                          ? 'CONSUMER'
                                          :  'FOODS'
                                        : ''}`
                                  }
                                  readOnly
                                />
                              </CCol>
                              <CCol xs={12} md={3}>
                                <CFormLabel htmlFor="inspectionDateTime">
                                  Tripsheet Creation Date & Time
                                </CFormLabel>

                                <CFormInput
                                  size="sm"
                                  id="TSCreationDateTime"
                                  value={
                                    irShipmentData.trip_sheet_info
                                      ? irShipmentData.trip_sheet_info.tripsheet_creation_time_string
                                      : '---'
                                  }
                                  readOnly
                                />
                              </CCol>

                            </CRow>
                            <CRow className="mt-2 mb-2" hidden>
                              <CCol xs={12} md={6}>
                                <CFormLabel
                                  htmlFor="inputAddress"
                                  style={{
                                    backgroundColor: '#4d3227',
                                    color: 'white',
                                  }}
                                >
                                  {`Shipment Information : `}
                                </CFormLabel>
                              </CCol>
                            </CRow>
                            <CRow>
                              <CCol xs={12} md={3}>
                                <CFormLabel htmlFor="tNum">Shipment Number</CFormLabel>
                                <CFormInput
                                  size="sm"
                                  id="tNum"
                                  value={selectedIrShipmentNumber}
                                  readOnly
                                />
                              </CCol>
                              <CCol xs={12} md={3}>
                                <CFormLabel htmlFor="tNum">Shipment Date</CFormLabel>
                                <CFormInput
                                  size="sm"
                                  id="tNum"
                                  value={irShipmentExistsData(irShipmentData,1)}
                                  readOnly
                                />
                              </CCol>   
                              <CCol xs={12} md={3}>
                                <CFormLabel htmlFor="tNum">Shipment Quantity in MTS</CFormLabel>
                                <CFormInput
                                  size="sm"
                                  id="tNum"
                                  value={irShipmentExistsData(irShipmentData,2)}
                                  readOnly
                                />
                              </CCol>  
                              <CCol xs={12} md={3}>
                                <CFormLabel htmlFor="tNum">Shipment Remarks</CFormLabel>
                                <CFormInput
                                  size="sm"
                                  id="tNum"
                                  value={irShipmentExistsData(irShipmentData,3)}
                                  readOnly
                                />
                              </CCol> 
                              <CCol xs={12} md={3}>
                                <CFormLabel htmlFor="tNum">Shipment Delivery Count</CFormLabel>
                                <CFormInput
                                  size="sm"
                                  id="tNum"
                                  value={irShipmentExistsData(irShipmentData,4)}
                                  readOnly
                                />
                              </CCol>  
                              <CCol xs={12} md={3}>
                                <CFormLabel htmlFor="tNum">Shipment PGI Status</CFormLabel>
                                <CFormInput
                                  size="sm"
                                  id="tNum"
                                  value={irShipmentExistsData(irShipmentData,5)}
                                  readOnly
                                />
                              </CCol>  
                              <CCol xs={12} md={3}>
                                <CFormLabel htmlFor="tNum">Shipment Status</CFormLabel>
                                <CFormInput
                                  size="sm"
                                  id="tNum"
                                  value={irShipmentExistsData(irShipmentData,6)}
                                  readOnly
                                />
                              </CCol>  
                            </CRow> 
                            <CRow className="mt-2 mb-2" hidden>
                              <CCol xs={12} md={6}>
                                <CFormLabel
                                  htmlFor="inputAddress"
                                  style={{
                                    backgroundColor: '#4d3227',
                                    color: 'white',
                                  }}
                                >
                                  {`Shipment Delivery Information`}
                                </CFormLabel>
                              </CCol>
                            </CRow> 
                            {irShipmentData.shipment_child_info.length > 0 && (
                              <>
                                {irShipmentData.shipment_child_info.map((datag, indexg) => { 
                                  return (
                                    <>
                                      <CRow>
                                        <CCol xs={12} md={2}>
                                          <CFormLabel htmlFor="tNum">Delivery Number</CFormLabel>
                                          <CFormInput
                                            size="sm"
                                            id="tNum"
                                            value={datag.delivery_no}
                                            readOnly
                                          />
                                        </CCol>   
                                        <CCol xs={12} md={2}>
                                          <CFormLabel htmlFor="tNum">Delivery Quantity in MTS</CFormLabel>
                                          <CFormInput
                                            size="sm"
                                            id="tNum" 
                                            value={datag.delivery_net_qty}
                                            readOnly
                                          />
                                        </CCol>                                      
                                        <CCol xs={12} md={4}>
                                          <CFormLabel htmlFor="tNum">Customer Name & Code</CFormLabel>
                                          <CFormInput
                                            size="sm"
                                            id="tNum"
                                            value={`${datag.customer_info?.CustomerName} (${datag.customer_info?.CustomerCode})`}
                                            readOnly
                                          />
                                        </CCol>
                                        <CCol xs={12} md={2}>
                                          <CFormLabel htmlFor="tNum">Customer City</CFormLabel>
                                          <CFormInput
                                            size="sm"
                                            id="tNum"
                                            value={datag.customer_info?.CustomerCity}
                                            readOnly
                                          />
                                        </CCol>
                                        <CCol xs={12} md={2}>
                                          <CFormLabel htmlFor="tNum">Invoice Number</CFormLabel>
                                          <CFormInput
                                            size="sm"
                                            id="tNum"
                                            value={datag.invoice_no}
                                            readOnly
                                          />
                                        </CCol>
                                        <CCol xs={12} md={2}>
                                          <CFormLabel htmlFor="tNum">Invoice Net Qty.</CFormLabel>
                                          <CFormInput
                                            size="sm"
                                            id="tNum"
                                            value={`${datag.invoice_net_quantity} ${datag.invoice_uom}`}
                                            readOnly
                                          />
                                        </CCol>
                                        <CCol xs={12} md={2}>
                                          <CFormLabel htmlFor="tNum">Plant / Total Line Item</CFormLabel>
                                          <CFormInput
                                            size="sm"
                                            id="tNum"
                                            value={`${datag.delivery_plant} / ${datag.total_line_item}`}
                                            readOnly
                                          />
                                        </CCol>
                                        <CCol xs={12} md={2}>
                                          <CFormLabel htmlFor="tNum">Sale Order Number</CFormLabel>
                                          <CFormInput
                                            size="sm"
                                            id="tNum"
                                            value={`${datag.sale_order_info?.SaleOrderNumber}`}
                                            readOnly
                                          />
                                        </CCol> 
                                        <CCol xs={12} md={2}>
                                          <CFormLabel htmlFor="tNum">Delivery Status</CFormLabel>
                                          <CFormInput
                                            size="sm"
                                            id="tNum"
                                            value={DSFinder(datag.delivery_status)}
                                            readOnly
                                          />
                                        </CCol>
                                        <CCol xs={12} md={2}>
                                          <CFormLabel htmlFor="tNum">Inco Term</CFormLabel>
                                          <CFormInput
                                            size="sm"
                                            id="tNum"
                                            value={incoTermFinder(datag.inco_term_id)}
                                            readOnly
                                          />
                                        </CCol>                                         
                                      </CRow>
                                      <ColoredLine color="red" />
                                    </>
                                  )
                                })}
                              </>
                            )}  
                             
                          </CCard>
                          
                        </>
                      )}
                      <CRow className="mt-md-3">
                        <CCol className="" xs={12} sm={12} md={3}>
                          <CButton 
                            size="sm" 
                            color="primary" 
                            className="text-white m-4" 
                            onClick={clearirShipmentData} 
                            type="button"
                          >
                            Previous
                          </CButton>
                        </CCol>
                        <CCol className="" xs={12} sm={12} md={3}></CCol> 
                        <CCol className="" xs={12} sm={12} md={3}></CCol> 
                        <CCol className="" xs={12} sm={12} md={3} style={{textAlign:"center",marginTop:"2.5%"}}>                       
                          <CButton
                            size="sm"
                            color="warning"
                            className="text-white"   
                            onClick={(e) => { 
                              setIrShimentModalEnable(true) 
                            }}
                          >
                            Shipment Invoice Reversal
                          </CButton>
                        </CCol>
                      </CRow>
                    </>
                  )}
                    
                    
                  </>
                </CTabPane>

                {/* 3 - Delivery Inco Term Edit */}
                <CTabPane role="tabpanel" aria-labelledby="home-tab" visible={currentProcessId == 3}>
                  {!tripSheetHaving && (
                    <>
                      <CRow>
                        <CCol xs={12} md={4}>
                          <div className="w-100 p-3">
                            <CFormLabel htmlFor="tripsheetNumberNew">
                              Enter Tripsheet Number
                              <REQ />{' '}

                            </CFormLabel>
                            <CInputGroup>
                              <CFormInput
                                size="sm"
                                name="tripsheetNumberNew"
                                id="tripsheetNumberNew"
                                maxLength={15}
                                autoComplete='off'
                                value={tripsheetNumberNew}
                                onChange={handleChangetripsheetNumberNew}
                              />
                              <CInputGroupText className="p-0">
                                <CButton
                                  size="sm"
                                  color="primary"
                                  onClick={(e) => {
                                    // setFetch(false)
                                    setSmallFetch(false)
                                    gettripSheetData(e)
                                  }}
                                >
                                  <i className="fa fa-search px-1"></i>
                                </CButton>
                                <CButton
                                  size="sm"
                                  style={{ marginLeft:"3px" }}
                                  color="primary"
                                  onClick={() => {
                                    window.location.reload(false)
                                  }}
                                >
                                  <i className="fa fa-refresh px-1"></i>
                                </CButton>
                              </CInputGroupText>
                            </CInputGroup>
                          </div>
                        </CCol>
                      </CRow>
                      <CRow>
                        <CCol>
                            <CButton 
                                size="sm" 
                                color="primary" 
                                className="text-white m-4" 
                                onClick={clearValuestripsheetNumber3} 
                                type="button"
                            >
                                Previous
                            </CButton>
                        </CCol>
                      </CRow>
                    </>
                  )}

                  {!smallfetch && <SmallLoader />}

                  {smallfetch && Object.keys(tripHirePaymentData).length != 0  && (
                    <>
                      <CCard style={{display: tripSheetHaving ? 'block' : 'none'}}  className="p-3">
                        <CRow>

                          <CCol xs={12} md={3}>
                            <CFormLabel htmlFor="vNum">Vehicle Number</CFormLabel>

                            <CFormInput size="sm" id="vNum" value={tripHirePaymentData.vehicle_number} readOnly />
                          </CCol>
                          <CCol xs={12} md={3}>
                            <CFormLabel htmlFor="vCap">Vehicle Capacity in MTS</CFormLabel>

                            <CFormInput
                              size="sm"
                              id="vCap"
                              value={
                                tripHirePaymentData.vehicle_capacity_id ? tripHirePaymentData.vehicle_capacity_id.capacity : ''
                              }
                              readOnly
                            />
                          </CCol>

                          <CCol xs={12} md={3}>
                            <CFormLabel htmlFor="vType">Vehicle Type</CFormLabel>

                            <CFormInput
                              size="sm"
                              id="vType"
                              value={tripHirePaymentData.vehicle_type_id ? tripHirePaymentData.vehicle_type_id.type : ''}
                              readOnly
                            />
                          </CCol>
                          <CCol xs={12} md={3}>
                            <CFormLabel htmlFor="dName">Driver Name</CFormLabel>

                            <CFormInput size="sm" id="dName" value={tripHirePaymentData.driver_name} readOnly />
                          </CCol>
                          <CCol xs={12} md={3}>
                            <CFormLabel htmlFor="dMob">Driver Cell Number</CFormLabel>

                            <CFormInput
                              size="sm"
                              id="dMob"
                              value={tripHirePaymentData.driver_contact_number}
                              readOnly
                            />
                          </CCol>
                          <CCol xs={12} md={3}>
                            <CFormLabel htmlFor="tNum">Tripsheet Number</CFormLabel>
                            <CFormInput
                              size="sm"
                              id="tNum"
                              value={
                                tripHirePaymentData.trip_sheet_info ? tripHirePaymentData.trip_sheet_info.trip_sheet_no : ''
                              }
                              readOnly
                            />
                          </CCol>
                          <CCol xs={12} md={3}>
                            <CFormLabel htmlFor="vtf">Trip Purpose / Division</CFormLabel>

                            <CFormInput
                              size="sm"
                              id="vtf"
                              value={`${tripHirePaymentData.trip_sheet_info
                                  ? tripHirePaymentData.trip_sheet_info.purpose == 1
                                    ? 'FG-SALES'
                                    : tripHirePaymentData.trip_sheet_info.purpose == 2
                                    ? 'FG-STO'
                                    : tripHirePaymentData.trip_sheet_info.purpose == 3
                                    ? 'RM-STO'
                                    : tripHirePaymentData.trip_sheet_info.purpose == 4
                                    ? 'OTHERS'
                                    : tripHirePaymentData.trip_sheet_info.purpose == 5
                                    ? 'FCI'
                                    : (tripHirePaymentData.vehicle_type_id && tripHirePaymentData.vehicle_type_id.id == 4 ? 'Party : FG-SALES': '')
                                  : ''} / ${tripHirePaymentData.trip_sheet_info
                                    ? tripHirePaymentData.trip_sheet_info.to_divison == 2
                                      ? 'CONSUMER'
                                      :  'FOODS'
                                    : ''}`
                              }
                              readOnly
                            />
                          </CCol>
                          <CCol xs={12} md={3}>
                            <CFormLabel htmlFor="inspectionDateTime">
                              Tripsheet Creation Date & Time
                            </CFormLabel>

                            <CFormInput
                              size="sm"
                              id="TSCreationDateTime"
                              value={
                                tripHirePaymentData.trip_sheet_info
                                  ? tripHirePaymentData.trip_sheet_info.tripsheet_creation_time_string
                                  : '---'
                              }
                              readOnly
                            />
                          </CCol>

                        </CRow>
                        {!shipmentHaving && (
                          <CRow className="mt-3">
                            <CCol>
                              <CButton
                                size="sm"
                                style={{ marginLeft:"3px" }}
                                color="primary"
                                onClick={() => {
                                  window.location.reload(false)
                                }}
                              >
                                Back
                              </CButton>
                              {shipmentError != '' && (
                                <span style={{ marginLeft:"10px" }} className="medium text-danger">* {shipmentError}</span>
                              )}
                            </CCol>

                          </CRow>
                        )}
                        {shipmentHaving && shipmentPossibility && (
                          <>
                            <CRow className="mt-2 mb-2" hidden>
                              <CCol xs={12} md={6}>
                                <CFormLabel
                                  htmlFor="inputAddress"
                                  style={{
                                    backgroundColor: '#4d3227',
                                    color: 'white',
                                  }}
                                >
                                  {`Shipment (${shipmentNumberNew}) Delivery Information`}
                                </CFormLabel>
                              </CCol>
                            </CRow> 
                            {shipmentDeliveryData.length > 0 && (
                              <>
                                {shipmentDeliveryData.map((datag, indexg) => { 
                                  return (
                                    <>
                                      <CRow>
                                        <CCol xs={12} md={2}>
                                          <CFormLabel htmlFor="tNum">Delivery Number</CFormLabel>
                                          <CFormInput
                                            size="sm"
                                            id="tNum"
                                            value={datag.delivery_no}
                                            readOnly
                                          />
                                        </CCol>                                        
                                        <CCol xs={12} md={4}>
                                          <CFormLabel htmlFor="tNum">Customer Name & Code</CFormLabel>
                                          <CFormInput
                                            size="sm"
                                            id="tNum"
                                            value={`${datag.customer_info?.CustomerName} (${datag.customer_info?.CustomerCode})`}
                                            readOnly
                                          />
                                        </CCol>
                                        <CCol xs={12} md={2}>
                                          <CFormLabel htmlFor="tNum">Customer City</CFormLabel>
                                          <CFormInput
                                            size="sm"
                                            id="tNum"
                                            value={datag.customer_info?.CustomerCity}
                                            readOnly
                                          />
                                        </CCol>
                                        <CCol xs={12} md={2}>
                                          <CFormLabel htmlFor="tNum">Invoice Number</CFormLabel>
                                          <CFormInput
                                            size="sm"
                                            id="tNum"
                                            value={datag.invoice_no}
                                            readOnly
                                          />
                                        </CCol>
                                        <CCol xs={12} md={2}>
                                          <CFormLabel htmlFor="tNum">Invoice Net Qty.</CFormLabel>
                                          <CFormInput
                                            size="sm"
                                            id="tNum"
                                            value={`${datag.invoice_net_quantity} ${datag.invoice_uom}`}
                                            readOnly
                                          />
                                        </CCol>
                                        <CCol xs={12} md={2}>
                                          <CFormLabel htmlFor="tNum">Plant / Total Line Item</CFormLabel>
                                          <CFormInput
                                            size="sm"
                                            id="tNum"
                                            value={`${datag.delivery_plant} / ${datag.total_line_item}`}
                                            readOnly
                                          />
                                        </CCol>
                                        <CCol xs={12} md={2}>
                                          <CFormLabel htmlFor="tNum">Sale Order Number</CFormLabel>
                                          <CFormInput
                                            size="sm"
                                            id="tNum"
                                            value={`${datag.sale_order_info?.SaleOrderNumber}`}
                                            readOnly
                                          />
                                        </CCol> 
                                        <CCol xs={12} md={2}>
                                          <CFormLabel htmlFor="tNum">Inco Term</CFormLabel>
                                          <CFormInput
                                            size="sm"
                                            id="tNum"
                                            value={incoTermFinder(datag.inco_term_id)}
                                            readOnly
                                          />
                                        </CCol>
                                        <CCol xs={12} md={2}>
                                          <CFormLabel htmlFor="tNum">Inco Term Update</CFormLabel>
                                          <CFormSelect
                                            size="sm"
                                            name="tpp_list"
                                            onChange={(e) => {
                                              incoTermUpdateChange(e, 'inco_term_id', indexg)
                                            }}
                                            value={incoTermUpdateValue(
                                              datag.inco_term_id,
                                              datag.inco_term_id_input
                                            )} 
                                            id="tpp_list"
                                          >
                                            <option value="0">Select ...</option>
                                            {incoTermsData.map((val,ind) => {
                                              return (
                                                <>
                                                  <option key={ind} value={val.definition_list_id}>
                                                    {`${val.definition_list_name} - (${val.definition_list_code})`}
                                                  </option>
                                                </>
                                              )
                                            })}
                                          </CFormSelect>
                                        </CCol>
                                      </CRow>
                                      <ColoredLine color="red" />
                                    </>
                                  )
                                })}
                              </>
                            )}                              
                            
                            <CRow className="mt-3">
                              <CCol className="" xs={12} sm={9} md={3}>
                                <CButton
                                  size="sm"
                                  style={{ marginLeft:"3px" }}
                                  color="primary"
                                  onClick={() => {
                                    window.location.reload(false)
                                  }}
                                >
                                  Back
                                </CButton>
                              </CCol>

                              <CCol
                                className="offset-md-6"
                                xs={12}
                                sm={9}
                                md={3}
                                style={{ display: 'flex', justifyContent: 'end' }}
                              >
                                <CButton
                                  size="sm"
                                  color="warning"
                                  className="mx-3 px-3 text-white"
                                  onClick={() => {
                                    shipmentIncoTermUpdateValidation()
                                  }}
                                >
                                  Update
                                </CButton>
                              </CCol>
                            </CRow>
                          </>
                        )}
                      </CCard>
                      {shipmentPossibility && (
                        <CCard style={{display: tripSheetHaving ? 'block' : 'none'}}  className="p-3">
                          {tripSheetHaving && !shipmentHaving && (
                            <CRow>
                              <CCol xs={12} md={4}>
                                <div className="w-100 p-3">
                                  <CFormLabel htmlFor="shipmentNumberNew">
                                    Enter Shipment Number
                                    <REQ />{' '}

                                  </CFormLabel>
                                  <CInputGroup>
                                    <CFormInput
                                      size="sm"
                                      name="shipmentNumberNew"
                                      id="shipmentNumberNew"
                                      maxLength={10}
                                      autoComplete='off'
                                      value={shipmentNumberNew}
                                      onChange={handleChangenewtrip1}
                                    />
                                    <CInputGroupText className="p-0">
                                      <CButton
                                        size="sm"
                                        color="primary"
                                        onClick={(e) => {
                                          // setFetch(false)
                                          setSmallFetch(false)
                                          getShipmentData()
                                        }}
                                      >
                                        <i className="fa fa-search px-1"></i>
                                      </CButton>

                                    </CInputGroupText>
                                  </CInputGroup>
                                </div>
                              </CCol>
                            </CRow>
                          )}
                        </CCard>
                      )}
                    </>
                  )}
                </CTabPane>

                {/* 4 - Partial Settlement Tripsheet Update */}
                <CTabPane role="tabpanel" aria-labelledby="home-tab" visible={currentProcessId == 4}>
                  <>
                    <CRow className="m-2"> 
                      <CCol xs={12} md={4}>
                        <CFormLabel htmlFor="vCap">Tripsheet Number</CFormLabel>
                        
                        <AdminPartialTripsheetSerachSelectComponent
                          size="sm"
                          className="mb-2"
                          name="partial_tripsheets"
                          id="partial_tripsheets"
                          onFocus={onFocus}
                          onBlur={onBlur}
                          onChange={handleMultipleChange}
                          selectedValue={values.partial_tripsheets} 
                          isMultiple={true}
                          label="Select Tripsheet Number"
                          noOptionsMessage="Tripsheet Not found" 
                          search_type={'partial_settlement_tripsheets'}
                          search_data={rjPartialSettlementData}
                        />
                      </CCol>
                    </CRow>
                    <CRow className="mt-md-3">
                      <CCol className="" xs={12} sm={12} md={3}>
                        <CButton 
                          size="sm" 
                          color="primary" 
                          className="text-white m-4" 
                          onClick={clearValuesType4} 
                          type="button"
                        >
                          Previous
                        </CButton>
                      </CCol>
                      <CCol className="" xs={12} sm={12} md={3}></CCol> 
                      <CCol className="" xs={12} sm={12} md={3}></CCol> 
                      <CCol className="" xs={12} sm={12} md={3} style={{textAlign:"center",marginTop:"4%"}}>                       
                        <CButton
                          size="sm"
                          color="warning"
                          className="text-white"  
                          onClick={partial_tripsheet_update}
                        >
                          Update
                        </CButton>
                      </CCol>
                    </CRow>
                  </>
                </CTabPane>

                {/* 5 - FG-SALES Delivery Update */}
                <CTabPane role="tabpanel" aria-labelledby="home-tab" visible={currentProcessId == 5}>
                  {!tripSheetHavingDR && (
                    <>
                      <CRow>
                        <CCol xs={12} md={4}>
                          <div className="w-100 p-3">
                            <CFormLabel htmlFor="tripsheetNumberNewDR">
                              Enter Tripsheet Number
                              <REQ />{' '}

                            </CFormLabel>
                            <CInputGroup>
                              <CFormInput
                                size="sm"
                                name="tripsheetNumberNewDR"
                                id="tripsheetNumberNewDR"
                                maxLength={15}
                                autoComplete='off'
                                value={tripsheetNumberNewDR}
                                onChange={handleChangetripsheetNumberNewDR}
                              />
                              <CInputGroupText className="p-0">
                                <CButton
                                  size="sm"
                                  color="primary"
                                  onClick={(e) => {
                                    // setFetch(false)
                                    setSmallFetch(false)
                                    gettripSheetDataDR(e)
                                  }}
                                >
                                  <i className="fa fa-search px-1"></i>
                                </CButton>
                                <CButton
                                  size="sm"
                                  style={{ marginLeft:"3px" }}
                                  color="primary"
                                  onClick={() => {
                                    window.location.reload(false)
                                  }}
                                >
                                  <i className="fa fa-refresh px-1"></i>
                                </CButton>
                              </CInputGroupText>
                            </CInputGroup>
                          </div>
                        </CCol>
                      </CRow>
                      <CRow>
                        <CCol>
                            <CButton 
                                size="sm" 
                                color="primary" 
                                className="text-white m-4" 
                                onClick={clearValuestripsheetNumber5} 
                                type="button"
                            >
                                Previous
                            </CButton>
                        </CCol>
                      </CRow>
                    </>
                  )}

                  {!smallfetch && <SmallLoader />}

                  {smallfetch && Object.keys(tripHirePaymentDataDR).length != 0  && (
                    <>
                      <CCard style={{display: tripSheetHavingDR ? 'block' : 'none'}}  className="p-3">
                        <CRow className="mt-2 mb-2" hidden>
                          <CCol xs={12} md={6}>
                            <CFormLabel
                              htmlFor="inputAddress"
                              style={{
                                backgroundColor: '#4d3227',
                                color: 'white',
                              }}
                            >
                              {`Tripsheet (${tripsheetNumberNewDR}) Information : `}
                            </CFormLabel>
                          </CCol>
                        </CRow> 
                        <CRow>

                          <CCol xs={12} md={3}>
                            <CFormLabel htmlFor="vNum">Vehicle Number</CFormLabel>

                            <CFormInput size="sm" id="vNum" value={tripHirePaymentDataDR.vehicle_number} readOnly />
                          </CCol>
                          <CCol xs={12} md={3}>
                            <CFormLabel htmlFor="vCap">Vehicle Capacity in MTS</CFormLabel>

                            <CFormInput
                              size="sm"
                              id="vCap"
                              value={
                                tripHirePaymentDataDR.vehicle_capacity_id ? tripHirePaymentDataDR.vehicle_capacity_id.capacity : ''
                              }
                              readOnly
                            />
                          </CCol>

                          <CCol xs={12} md={3}>
                            <CFormLabel htmlFor="vType">Vehicle Type</CFormLabel>

                            <CFormInput
                              size="sm"
                              id="vType"
                              value={tripHirePaymentDataDR.vehicle_type_id ? tripHirePaymentDataDR.vehicle_type_id.type : ''}
                              readOnly
                            />
                          </CCol>
                          <CCol xs={12} md={3}>
                            <CFormLabel htmlFor="dName">Driver Name</CFormLabel>

                            <CFormInput size="sm" id="dName" value={tripHirePaymentDataDR.driver_name} readOnly />
                          </CCol>
                          <CCol xs={12} md={3}>
                            <CFormLabel htmlFor="dMob">Driver Cell Number</CFormLabel>

                            <CFormInput
                              size="sm"
                              id="dMob"
                              value={tripHirePaymentDataDR.driver_contact_number}
                              readOnly
                            />
                          </CCol>
                          <CCol xs={12} md={3}>
                            <CFormLabel htmlFor="tNum">Tripsheet Remarks</CFormLabel>
                            <CFormInput
                              size="sm"
                              id="tNum"
                              value={
                                tripHirePaymentDataDR.trip_sheet_info ? tripHirePaymentDataDR.trip_sheet_info.remarks : '-'
                              }
                              readOnly
                            />
                          </CCol>
                          <CCol xs={12} md={3}>
                            <CFormLabel htmlFor="vtf">Trip Purpose / Division</CFormLabel>

                            <CFormInput
                              size="sm"
                              id="vtf"
                              value={`${tripHirePaymentDataDR.trip_sheet_info
                                  ? tripHirePaymentDataDR.trip_sheet_info.purpose == 1
                                    ? 'FG-SALES'
                                    : tripHirePaymentDataDR.trip_sheet_info.purpose == 2
                                    ? 'FG-STO'
                                    : tripHirePaymentDataDR.trip_sheet_info.purpose == 3
                                    ? 'RM-STO'
                                    : tripHirePaymentDataDR.trip_sheet_info.purpose == 4
                                    ? 'OTHERS'
                                    : tripHirePaymentDataDR.trip_sheet_info.purpose == 5
                                    ? 'FCI'
                                    : (tripHirePaymentDataDR.vehicle_type_id && tripHirePaymentDataDR.vehicle_type_id.id == 4 ? 'Party : FG-SALES': '')
                                  : ''} / ${tripHirePaymentDataDR.trip_sheet_info
                                    ? tripHirePaymentDataDR.trip_sheet_info.to_divison == 2
                                      ? 'CONSUMER'
                                      :  'FOODS'
                                    : ''}`
                              }
                              readOnly
                            />
                          </CCol>
                          <CCol xs={12} md={3}>
                            <CFormLabel htmlFor="inspectionDateTime">
                              Tripsheet Creation Date & Time
                            </CFormLabel>

                            <CFormInput
                              size="sm"
                              id="TSCreationDateTime"
                              value={
                                tripHirePaymentDataDR.trip_sheet_info
                                  ? tripHirePaymentDataDR.trip_sheet_info.tripsheet_creation_time_string
                                  : '---'
                              }
                              readOnly
                            />
                          </CCol>

                        </CRow>
                        {!shipmentHavingDR && (
                          <CRow className="mt-3">
                            <CCol>
                              <CButton
                                size="sm"
                                style={{ marginLeft:"3px" }}
                                color="primary"
                                onClick={() => {
                                  window.location.reload(false)
                                }}
                              >
                                Back
                              </CButton>
                              {shipmentErrorDR != '' && (
                                <span style={{ marginLeft:"10px" }} className="medium text-danger">* {shipmentErrorDR}</span>
                              )}
                            </CCol>

                          </CRow>
                        )}
                        {shipmentHavingDR && shipmentPossibilityDR && (
                          <>
                            {shipmentExists(shipmentNumberNewDR,tripHirePaymentDataDR) && (
                              <>
                                <CRow className="mt-2 mb-2" hidden>
                                  <CCol xs={12} md={6}>
                                    <CFormLabel
                                      htmlFor="inputAddress"
                                      style={{
                                        backgroundColor: '#4d3227',
                                        color: 'white',
                                      }}
                                    >
                                      {`Shipment (${shipmentNumberNewDR}) Information : `}
                                    </CFormLabel>
                                  </CCol>
                                </CRow> 
                                <CRow>
                                  <CCol xs={12} md={3}>
                                    <CFormLabel htmlFor="tNum">Shipment Date</CFormLabel>
                                    <CFormInput
                                      size="sm"
                                      id="tNum"
                                      value={shipmentExistsData(shipmentNumberNewDR,tripHirePaymentDataDR,1)}
                                      readOnly
                                    />
                                  </CCol>   
                                  <CCol xs={12} md={3}>
                                    <CFormLabel htmlFor="tNum">Shipment Quantity in MTS</CFormLabel>
                                    <CFormInput
                                      size="sm"
                                      id="tNum"
                                      value={shipmentExistsData(shipmentNumberNewDR,tripHirePaymentDataDR,2)}
                                      readOnly
                                    />
                                  </CCol>  
                                  <CCol xs={12} md={3}>
                                    <CFormLabel htmlFor="tNum">Shipment Remarks</CFormLabel>
                                    <CFormInput
                                      size="sm"
                                      id="tNum"
                                      value={shipmentExistsData(shipmentNumberNewDR,tripHirePaymentDataDR,3)}
                                      readOnly
                                    />
                                  </CCol> 
                                  <CCol xs={12} md={3}>
                                    <CFormLabel htmlFor="tNum">Shipment Delivery Count</CFormLabel>
                                    <CFormInput
                                      size="sm"
                                      id="tNum"
                                      value={shipmentExistsData(shipmentNumberNewDR,tripHirePaymentDataDR,4)}
                                      readOnly
                                    />
                                  </CCol>  
                                  <CCol xs={12} md={3}>
                                    <CFormLabel htmlFor="tNum">Shipment PGI Status</CFormLabel>
                                    <CFormInput
                                      size="sm"
                                      id="tNum"
                                      value={shipmentExistsData(shipmentNumberNewDR,tripHirePaymentDataDR,5)}
                                      readOnly
                                    />
                                  </CCol>  
                                  <CCol xs={12} md={3}>
                                    <CFormLabel htmlFor="tNum">Shipment Status</CFormLabel>
                                    <CFormInput
                                      size="sm"
                                      id="tNum"
                                      value={shipmentExistsData(shipmentNumberNewDR,tripHirePaymentDataDR,6)}
                                      readOnly
                                    />
                                  </CCol>  
                                </CRow> 
                              </>
                            )

                            }
                            <CRow className="mt-2 mb-2" hidden>
                              <CCol xs={12} md={6}>
                                <CFormLabel
                                  htmlFor="inputAddress"
                                  style={{
                                    backgroundColor: '#4d3227',
                                    color: 'white',
                                  }}
                                >
                                  {`Shipment Delivery Information : `}
                                </CFormLabel>
                              </CCol>
                            </CRow> 
                            {shipmentDeliveryDataDR.length > 0 && (
                              <>
                                {shipmentDeliveryDataDR.map((datag, indexg) => { 
                                  return (
                                    <>
                                      <CRow>
                                        <CCol xs={12} md={2}>
                                          <CFormLabel htmlFor="tNum">Delivery Number</CFormLabel>
                                          <CFormInput
                                            size="sm"
                                            id="tNum"
                                            value={datag.delivery_no}
                                            readOnly
                                          />                                          
                                        </CCol>  
                                        <CCol xs={12} md={2}>
                                          <CFormLabel htmlFor="tNum">Delivery Quantity in MTS</CFormLabel>
                                          <CFormInput
                                            size="sm"
                                            id="tNum"
                                            // value={datag.invoice_net_quantity ? datag.invoice_net_quantity : datag.delivery_net_qty}
                                            value={datag.delivery_net_qty}
                                            readOnly
                                          />
                                        </CCol>                                      
                                        <CCol xs={12} md={4}>
                                          <CFormLabel htmlFor="tNum">Customer Name & Code</CFormLabel>
                                          <CFormInput
                                            size="sm"
                                            id="tNum"
                                            value={`${datag.customer_info?.CustomerName} (${datag.customer_info?.CustomerCode})`}
                                            readOnly
                                          />
                                        </CCol>
                                        <CCol xs={12} md={2}>
                                          <CFormLabel htmlFor="tNum">Customer City</CFormLabel>
                                          <CFormInput
                                            size="sm"
                                            id="tNum"
                                            value={datag.customer_info?.CustomerCity}
                                            readOnly
                                          />
                                        </CCol>
                                        <CCol xs={12} md={2}>
                                          <CFormLabel htmlFor="tNum">Sale Order Number</CFormLabel>
                                          <CFormInput
                                            size="sm"
                                            id="tNum"
                                            value={`${datag.sale_order_info?.SaleOrderNumber}`}
                                            readOnly
                                          />
                                        </CCol>
                                        <CCol xs={12} md={2}>
                                          <CFormLabel htmlFor="tNum">Invoice Number</CFormLabel>
                                          <CFormInput
                                            size="sm"
                                            id="tNum"
                                            value={datag.invoice_no ? datag.invoice_no : '-'}
                                            readOnly
                                          />
                                        </CCol>
                                        <CCol xs={12} md={2}>
                                          <CFormLabel htmlFor="tNum">Invoice Net Qty.</CFormLabel>
                                          <CFormInput
                                            size="sm"
                                            id="tNum"
                                            value={datag.invoice_no ? `${datag.invoice_net_quantity} ${datag.invoice_uom}` : '-'}
                                            readOnly
                                          />
                                        </CCol>
                                        <CCol xs={12} md={2}>
                                          <CFormLabel htmlFor="tNum">Plant / Total Line Item</CFormLabel>
                                          <CFormInput
                                            size="sm"
                                            id="tNum"
                                            value={`${datag.delivery_plant} / ${datag.total_line_item}`}
                                            readOnly
                                          />
                                        </CCol>                                        
                                        <CCol xs={12} md={2}>
                                          <CFormLabel htmlFor="tNum">Delivery Status</CFormLabel>
                                          <CFormInput
                                            size="sm"
                                            id="tNum"
                                            value={DSFinder(datag.delivery_status)}
                                            readOnly
                                          />
                                        </CCol>
                                        <CCol xs={12} md={2}>
                                          <CFormLabel htmlFor="tNum">Inco Term</CFormLabel>
                                          <CFormInput
                                            size="sm"
                                            id="tNum"
                                            value={incoTermFinder(datag.inco_term_id)}
                                            readOnly
                                          />
                                        </CCol>
                                        {/* <CCol xs={12} md={2} style={{marginTop:"1.7%", textAlign:"center"}}>  */}
                                        <CCol xs={12} md={2} style={{marginTop:"1.7%"}}> 
                                        {/* <CCol
                                          className="offset-md-6"
                                          xs={12}
                                          sm={9}
                                          md={2}
                                          style={{ display: 'flex', justifyContent: 'end' }}
                                        > */}
                                          <CButton
                                            size="sm"
                                            color="danger"
                                            className="text-white"
                                            onClick={() => {
                                              setDeliveryDelete(true)
                                              setDeliveryNoToDelete(datag.delivery_no) 
                                              setDeliveryQty(datag.delivery_net_qty) 
                                            }} 
                                          >
                                            Remove
                                            <i className="fa fa-close px-1"></i>
                                          </CButton>
                                          {datag.delivery_status == 1 && 
                                            <CTooltip
                                              content="PGI Confirm"
                                              placement="top"
                                            >
                                              <CButton
                                                size="sm"
                                                style={{marginLeft:"5px"}}
                                                color="success"
                                                className="text-white"
                                                onClick={() => {
                                                  setPgiUpdateModal(true)
                                                  setPgiUpdateProcess(1) 
                                                  setDeliveryNoToPgiUpdate(datag.delivery_no)
                                                }} 
                                              >
                                                PGI 
                                                <i className="fa fa-check px-1"></i>
                                              </CButton>
                                            </CTooltip>
                                          }
                                          {datag.delivery_status == 3 && 
                                            <CTooltip
                                              content="PGI Reversal"
                                              placement="top"
                                            >
                                              <CButton
                                                size="sm"
                                                style={{marginLeft:"5px"}}
                                                color="danger"
                                                className="text-white"
                                                onClick={() => {
                                                  setPgiUpdateModal(true)
                                                  setPgiUpdateProcess(2)
                                                  setDeliveryNoToPgiUpdate(datag.delivery_no)
                                                }} 
                                              >
                                                PGI  
                                                <i className="fa fa-window-close-o px-1"></i>
                                              </CButton>
                                            </CTooltip>
                                          }
                                        </CCol>
                                         
                                      </CRow>
                                      <ColoredLine color="red" />
                                    </>
                                  )
                                })}
                              </>
                            )}                              
                            
                            <CRow className="mt-3">
                              <CCol className="" xs={12} sm={9} md={3}>
                                <CButton
                                  size="sm"
                                  style={{ marginLeft:"3px" }}
                                  color="primary"
                                  onClick={() => {
                                    window.location.reload(false)
                                  }}
                                >
                                  Back
                                </CButton>
                              </CCol>                              
                            </CRow>
                          </>
                        )}
                      </CCard>
                      {shipmentPossibilityDR && (
                        <CCard style={{display: tripSheetHavingDR ? 'block' : 'none'}}  className="p-3">
                          {tripSheetHavingDR && !shipmentHavingDR && (
                            <CRow>
                              <CCol xs={12} md={4}>
                                <div className="w-100 p-3">
                                  <CFormLabel htmlFor="shipmentNumberNewDR">
                                    Enter Shipment Number
                                    <REQ />{' '}

                                  </CFormLabel>
                                  <CInputGroup>
                                    <CFormInput
                                      size="sm"
                                      name="shipmentNumberNewDR"
                                      id="shipmentNumberNewDR"
                                      maxLength={10}
                                      autoComplete='off'
                                      value={shipmentNumberNewDR}
                                      onChange={handleChangenewtrip1DR}
                                    />
                                    <CInputGroupText className="p-0">
                                      <CButton
                                        size="sm"
                                        color="primary"
                                        onClick={(e) => {
                                          // setFetch(false)
                                          setSmallFetch(false)
                                          getShipmentDataDR()
                                        }}
                                      >
                                        <i className="fa fa-search px-1"></i>
                                      </CButton>

                                    </CInputGroupText>
                                  </CInputGroup>
                                </div>
                              </CCol>
                            </CRow>
                          )}
                        </CCard>
                      )}
                    </>
                  )}
                </CTabPane>

                {/* 6 - Tripsheet Purpose & Division Change */}
                <CTabPane role="tabpanel" aria-labelledby="home-tab" visible={currentProcessId == 6}>
                    <>  
                        {!tripsheetNumber6Having && (                     
                            <CRow>
                                <CCol xs={12} md={4}>
                                    <div className="w-100 p-3">
                                    <CFormLabel htmlFor="tripsheetNumber6">
                                        Enter Tripsheet Number
                                        <REQ />{' '}

                                    </CFormLabel>
                                    <CInputGroup>
                                        <CFormInput
                                          size="sm"
                                          name="tripsheetNumber6"
                                          id="tripsheetNumber6"
                                          maxLength={15}
                                          autoComplete='off'
                                          value={tripsheetNumber6}
                                          onChange={handleTripsheetNumber6}
                                        />
                                        <CInputGroupText className="p-0">
                                        <CButton
                                            size="sm"
                                            color="primary"
                                            onClick={(e) => { 
                                                setSmallFetch(false)
                                                gettripsheetNumber6Data(e)
                                            }}
                                        >
                                            <i className="fa fa-search px-1"></i>
                                        </CButton>
                                        <CButton
                                            size="sm"
                                            style={{ marginLeft:"3px" }}
                                            color="primary"
                                            onClick={() => {
                                            window.location.reload(false)
                                            }}
                                        >
                                            <i className="fa fa-refresh px-1"></i>
                                        </CButton>
                                        </CInputGroupText>
                                    </CInputGroup>
                                    </div>
                                </CCol>
                            </CRow>
                        )} 
                        {!smallfetch && <SmallLoader />}
                        {smallfetch && Object.keys(tripsheetNumber6Data).length != 0  && (
                            <>
                                <CCard style={{display: tripsheetNumber6Having ? 'block' : 'none'}}  className="p-3">
                                    <CRow className="mt-2" hidden>
                                        <CCol xs={12} md={3}>
                                            <CFormLabel
                                                htmlFor="inputAddress"
                                                style={{
                                                    backgroundColor: '#4d3227',
                                                    color: 'white',
                                                }}
                                            >
                                                Tripsheet Info
                                            </CFormLabel>
                                        </CCol>
                                    </CRow>
                                    <CRow>
                                        <CCol xs={12} md={2}>
                                            <CFormLabel htmlFor="dName">Tripsheet Number</CFormLabel>
                                            <CFormInput 
                                                size="sm" 
                                                id="dName" 
                                                value={tripsheetNumber6Data.trip_sheet_info?.trip_sheet_no} readOnly 
                                            />
                                        </CCol>
                                        <CCol xs={12} md={2}>
                                            <CFormLabel htmlFor="dName">Vehicle Number</CFormLabel>
                                            <CFormInput 
                                                size="sm" 
                                                id="dName" 
                                                value={tripsheetNumber6Data.vehicle_number} readOnly 
                                            />
                                        </CCol>
                                        <CCol xs={12} md={2}>
                                            <CFormLabel htmlFor="dName">Vehicle Capacity in MTS</CFormLabel>
                                            <CFormInput 
                                                size="sm" 
                                                id="dName" 
                                                value={tripsheetNumber6Data.vehicle_capacity_id?.capacity} readOnly 
                                            />
                                        </CCol>
                                        <CCol xs={12} md={2}>
                                            <CFormLabel htmlFor="dName">Division</CFormLabel>
                                            <CFormInput 
                                                size="sm" 
                                                id="dName" 
                                                value={tripDivisionFinder(tripsheetNumber6Data.trip_sheet_info?.to_divison)} readOnly 
                                            />
                                        </CCol>
                                        <CCol xs={12} md={2}>
                                            <CFormLabel htmlFor="dName">Purpose</CFormLabel>
                                            <CFormInput 
                                                size="sm" 
                                                id="dName" 
                                                value={tripPurposeFinder(tripsheetNumber6Data.trip_sheet_info?.purpose)} readOnly  
                                            />
                                        </CCol>                                        

                                        <CCol xs={12} md={2}>
                                          <CFormLabel htmlFor="DefectType">Updated Purpose</CFormLabel>
                                          
                                          <CFormSelect
                                            size="sm"
                                            onChange={(e) => {
                                              changesType6(e,1)
                                            }}
                                            value={changedTrip6Purpose}
                                          >
                                            <option value="">Select...</option>
                                            <option value="1" hidden={tripsheetNumber6Data.trip_sheet_info?.purpose == 1} >FG-SALES</option>
                                            <option value="2" hidden={tripsheetNumber6Data.trip_sheet_info?.purpose == 2}>FG-STO</option>
                                            <option value="3" hidden={tripsheetNumber6Data.trip_sheet_info?.purpose == 3}>RMSTO</option> 
                                          </CFormSelect>
                                        </CCol>

                                        <CCol xs={12} md={2}>
                                          <CFormLabel htmlFor="DefectType">Updated Division</CFormLabel>
                                          
                                          <CFormSelect
                                            size="sm"
                                            onChange={(e) => {
                                              changesType6(e,2)
                                            }}
                                            value={changedTrip6Division}
                                          >
                                            <option value="">Select...</option>
                                            <option value="1">NLFD</option>
                                            <option value="2">NLCD</option>                                             
                                          </CFormSelect>
                                        </CCol>

                                        <CCol xs={12} md={2}>
                                          <CFormLabel htmlFor="updatedFPT1">
                                              Parking Status
                                          </CFormLabel>
                                          <CFormInput 
                                              id="updatedFPT1" 
                                              name="updatedFPT1" 
                                              value={changedTrip6PS}
                                              size='sm'
                                              maxLength={4}
                                              onChange={(e) => {
                                                changesType6(e,3)
                                              }}  
                                          />
                                        </CCol>

                                        <CCol xs={12} md={2}>
                                          <CFormLabel htmlFor="updatedFPT1">
                                              Remarks
                                          </CFormLabel>
                                          <CFormInput 
                                              id="updatedFPT1" 
                                              name="updatedFPT1" 
                                              value={changedTrip6Remarks}
                                              size='sm'
                                              maxLength={4}
                                              onChange={(e) => {
                                                changesType6(e,4)
                                              }}  
                                          />
                                        </CCol>

                                        <CCol className="mt-4" xs={12} md={2} style={{ display: 'flex', justifyContent: 'end' }}>
                                          <CButton
                                              size="sm"
                                              color="warning" 
                                              className="mx-3 px-3 text-white" 
                                              onClick={() => {
                                                  changesType6Submit()
                                              }}
                                          >
                                              Submit
                                          </CButton>
                                        </CCol>

                                        
                                  
                                        {/* ===============ASK============= */}
                                                                          
                                        
                                    </CRow>
                                    <ColoredLine color="red" />
                                    
                                    
                                </CCard>
                            </>
                        )}
                        <CRow>
                            <CCol>
                                <CButton 
                                    size="sm" 
                                    color="primary" 
                                    className="text-white m-4" 
                                    onClick={clearValuestripsheetNumber6} 
                                    type="button"
                                >
                                    Previous
                                </CButton>
                            </CCol>
                        </CRow>
                         
                    </>
                </CTabPane>

              </CTabContent>
            </CCard>

            {/* Error Modal Section */}
            <CModal visible={errorModal} onClose={() => setErrorModal(false)}>
              <CModalHeader>
                <CModalTitle className="h4">Error</CModalTitle>
              </CModalHeader>
              <CModalBody>
                <CRow>
                  <CCol>
                    {error && (
                      <CAlert color="danger" data-aos="fade-down">
                        {error}
                      </CAlert>
                    )}
                  </CCol>
                </CRow>
              </CModalBody>
              <CModalFooter>
                <CButton onClick={() => setErrorModal(false)} color="primary">
                  Close
                </CButton>
              </CModalFooter>
            </CModal>
            {/* Error Modal Section */}

            {/* ======================= Confirm Button Modal Area ========================== */}
            <CModal
              visible={pgiUpdateModal}
              onClose={() => {
                setPgiUpdateModal(false)
                setPgiUpdateProcess('') 
                setDeliveryNoToPgiUpdate('')
              }}
            >
              <CModalHeader
                style={{
                  backgroundColor: '#ebc999',
                }}
              >
                <CModalTitle>Confirmation To Update</CModalTitle>
              </CModalHeader>
              <CModalBody>
                <p className="lead"> 
                  Are you sure to PGI {pgiUpdateProcess == 1 ? 'Confirm' : 'Reversal'} for this Delivery ({deliveryNoToPgiUpdate})?
                </p> 
              </CModalBody>
              <CModalFooter>
                <CButton
                  className="m-2"
                  color="warning"
                  onClick={() => {                  
                    setFetch(false)
                    pgiUpdateDelivery()
                    setPgiUpdateModal(false)
                  }}
                >
                  Confirm
                </CButton>
                <CButton
                  color="secondary"
                  onClick={() => {
                    setPgiUpdateModal(false)
                    setPgiUpdateProcess('') 
                    setDeliveryNoToPgiUpdate('')
                  }}
                >
                  Cancel
                </CButton> 
              </CModalFooter>
            </CModal>

            <CModal
              visible={deliveryDelete}
              onClose={() => {
                setDeliveryDelete(false)
                setDeliveryNoToDelete('')
                setDeliveryQty('') 
              }}
            >
              <CModalHeader
                style={{
                  backgroundColor: '#ebc999',
                }}
              >
                <CModalTitle>Confirmation To Delete</CModalTitle>
              </CModalHeader>
              <CModalBody>
                <p className="lead"> 
                  Are you sure to delete this Delivery ({deliveryNoToDelete})?
                </p> 
              </CModalBody>
              <CModalFooter>
                <CButton
                  className="m-2"
                  color="warning"
                  onClick={() => {                  
                    setFetch(false)
                    deleteDelivery()
                    setDeliveryDelete(false)
                  }}
                >
                  Confirm
                </CButton>
                <CButton
                  color="secondary"
                  onClick={() => {
                    setDeliveryDelete(false)
                    setDeliveryNoToDelete('')
                    setDeliveryQty('') 
                  }}
                >
                  Cancel
                </CButton> 
              </CModalFooter>
            </CModal>
            {/* *********************************************************** */}

            {/* ======================= Confirm Button Modal Area ========================== */}
            <CModal
              visible={irShimentModalEnable}
              onClose={() => {
                setIrShimentModalEnable(false) 
              }}
            >
              <CModalHeader
                style={{
                  backgroundColor: '#ebc999',
                }}
              >
                <CModalTitle>Confirmation To Shipment's Invoice Reversal</CModalTitle>
              </CModalHeader>
              <CModalBody>
                <p className="lead"> 
                  Are you sure to reverse this Shipment's ({selectedIrShipmentNumber}) Invoice?
                </p> 
              </CModalBody>
              <CModalFooter>
                <CButton
                  className="m-2"
                  color="warning"
                  onClick={() => {   
                    reverseShipmentInvoice()
                    setIrShimentModalEnable(false)
                  }}
                >
                  Confirm
                </CButton>
                <CButton
                  color="secondary"
                  onClick={() => {
                    setIrShimentModalEnable(false) 
                  }}
                >
                  Cancel
                </CButton> 
              </CModalFooter>
            </CModal>
            {/* *********************************************************** */}
 
           </>
          ) : (<AccessDeniedComponent />)}
          </>
        )}
      </>
    )
  }
  export default AdminSettingsHome

