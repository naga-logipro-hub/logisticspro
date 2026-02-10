/* eslint-disable  */
import {
  CButton,
  CCard,
  CCol,
  CContainer,
  CForm,
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
  CModal,
  CModalTitle,
  CModalHeader,
  CModalBody,
  CAlert,
  CModalFooter,
} from '@coreui/react'
import React, { useState, useEffect } from 'react'
import useForm from 'src/Hooks/useForm'
import { useNavigate, useParams } from 'react-router-dom'
import validate from 'src/Validations/FormValidation'
import CustomTable from '../../components/customComponent/CustomTable'
import { Link } from 'react-router-dom'
import DieselIntentCreationService from 'src/Service/DieselIntent/DieselIntentCreationService'
import DieselIntentValidation from 'src/Utils/DieselIntent/DieselIntentValidation'
import { ToastContainer, toast } from 'react-toastify'
import Loader from 'src/components/Loader'
import DieselVendorMasterService from 'src/Service/Master/DieselVendorMasterService'
import ReportService from 'src/Service/Report/ReportService'

import Webcam from 'react-webcam'
import CIcon from '@coreui/icons-react'
import * as icon from '@coreui/icons';

import AccessDeniedComponent from 'src/components/commoncomponent/AccessDeniedComponent'
import JavascriptInArrayComponent from 'src/components/commoncomponent/JavascriptInArrayComponent'
import * as LogisticsProScreenNumberConstants from 'src/components/constants/LogisticsProScreenNumberConstants'

import FileResizer from 'react-image-file-resizer'
import DieseVendorSelectComponent from 'src/components/commoncomponent/DieselVendorSelectComponent'

const DiIntentConfirmation = () => {
  const user_info_json = localStorage.getItem('user_info')
  const user_info = JSON.parse(user_info_json)

  /* Get User Id From Local Storage */
  const user_id = user_info.user_id

  /* ==================== Access Part Start ========================*/
const [screenAccess, setScreenAccess] = useState(false)
let page_no = LogisticsProScreenNumberConstants.DieselIntentModule.Diesel_Intent_Confirmation_Request

useEffect(()=>{

  if(user_info.is_admin == 1 || JavascriptInArrayComponent(page_no,user_info.page_permissions)){
    console.log('screen-access-allowed')
    setScreenAccess(true)
  } else{
    console.log('screen-access-not-allowed')
    setScreenAccess(false)
  }

},[])
/* ==================== Access Part End ========================*/

  const formValues = {
    vehicle_id: '',
    vendor_code: '',
    invoice_no: '',
    invoice_copy: '',
    no_of_ltrs: '',
    rate_of_ltrs: '',
    total_amount: '',
    bunk_reading: '',
    diesel_intent_po_no: '',
    diesel_status: '',
    remarks: '',
    diesel_vendor_name: '',
  }

  const { id } = useParams()
  const [state, setState] = useState({
    page_loading: false,
  })
  const [singleVehicleInfo, setSingleVehicleInfo] = useState(false)
  const [dirverAssign, setDirverAssign] = useState(true)
  const [fetch, setFetch] = useState(false)
  const [vendorData, setvendorData] = useState({})
  const [validateSubmit, setValidateSubmit] = useState(true)
  const [vendor, setVendor] = useState(false)
  const [acceptBtn, setAcceptBtn] = useState(true)
  const [acceptBtn1, setAcceptBtn1] = useState(true)
  const [errorModal, setErrorModal] = useState(false)
  const [error, setError] = useState({})
  const [vendor_no, setVendor_no] = useState('')
  const navigation = useNavigate()
  const vehicleType = {
    OWN: 1,
    CONTRACT: 2,
    HIRE: 3,
  }
  const REQ = () => <span className="text-danger"> * </span>

  const formatter = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 3,
    maximumFractionDigits: 3,
  })
  const formatter1 = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })
  useEffect(() => {
    ReportService.singleDieselDetailsList(id).then((res) => {
      console.log(res.data.data)
      if (res.status === 200) {
        values.vendor_code = res.data.data != null ? res.data.data.vendor_code : ''
        DieselVendorMasterService.getDieselVendorsByCode(values.vendor_code).then((res) => {
          console.log(res)
          // values.diesel_vendor_name = res.data.data.diesel_vendor_name
          values.diesel_vendor_name = res.data.data != null ? res.data.data.diesel_vendor_name : ''
          values.diesel_vendor_id = res.data.data != null ? res.data.data.diesel_vendor_id : ''
          setFetch(true)
        })
        isTouched.vehicle_id = true
        isTouched.driver_id = true
        isTouched.tripsheet_id = true
        isTouched.vehicle_type_id = true
        values.parking_id = true
        values.parking_id = res.data.data.parking_id
        values.driver_id = res.data.data !=null ? res.data.data.driver_id:''
        values.vehicle_type_id = res.data.data.parking_info !=null ? res.data.data.parking_info.vehicle_type_id.id :''
        values.tripsheet_id =res.data.data != null ? res.data.data.tripsheet_id : ''
        values.trip_sheet_no =
          res.data.data.parking_info.trip_sheet_info != null ? res.data.data.parking_info.trip_sheet_info.trip_sheet_no : ''
        values.total_amount =
          res.data.data != null
            ? res.data.data.total_amount
            : ''

        // res.data.data.diesel_vendor != null ? res.data.data.diesel_vendor.diesel_vendor_name : ''
        values.no_of_ltrs =
          res.data.data != null
            ? res.data.data.no_of_ltrs
            : ''
        // values.driver_code =
        //   res.data.data.parking_info.driver_info != null ? res.data.data.driver_info.parking_info.driver_code : ''
        // values.diesel_vendor_name=
        // res.data.data.diesel_vendor != null ? res.data.data.diesel_vendor.diesel_vendor_name : ''
        // values.vehicle_type_id = res.data.data.parking_info.vehicle_type_id.id
        values.vehicle_id = res.data.data.parking_info != null ? res.data.data.parking_info.vehicle_id :''
        values.vehicle_number = res.data.data.parking_info != null ? res.data.data.parking_info.vehicle_number :''
        setSingleVehicleInfo(res.data.data)
        console.log(singleVehicleInfo)
      }
    })
  }, [])

  const { values, errors, handleChange, onFocus, handleSubmit, enableSubmit, onBlur, isTouched } =
    useForm(CreateDieselIntent, DieselIntentValidation, formValues)

   /* ====================Bunk Reading Web Cam Start ========================*/
    const webcamRef = React.useRef(null);
    const [fileuploaded, setFileuploaded] = useState(false)
    const [camEnable, setCamEnable] = useState(false)
    const [imgSrc, setImgSrc] = React.useState(null);

    const capture = React.useCallback(() => {
      const imageSrc = webcamRef.current.getScreenshot();
      setImgSrc(imageSrc);
    }, [webcamRef, setImgSrc]);

   /* ====================Bunk Reading Web Cam End ========================*/

  /* ==================== Bunk Reading ReSize Start ========================*/
    const resizeFile = (file) => new Promise(resolve => {
      FileResizer.imageFileResizer(file, 1000, 1000, 'JPEG', 100, 0,
      uri => {
        resolve(uri);
      }, 'base64' );
    })

    const imageCompress = async (event) => {
      const file = event.target.files[0];
      console.log(file)

      if(file.type == 'application/pdf') {

      if(file.size > 5000000){
        alert('File to Big, please select a file less than 5mb')
        setFileuploaded(false)
      } else {
        values.bunk_reading = file
        setFileuploaded(true)
      }
    }else{

      const image = await resizeFile(file);
      if(file.size > 2000000){ // Condition Set only for compress more than 2mb files
        valueAppendToImage(image)
        setFileuploaded(true)
      } else {
        values.bunk_reading = file
        setFileuploaded(true)
      }
    }
  }

    const dataURLtoFile = (dataurl, filename) => {
      var arr = dataurl.split(','),
        mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]),
        n = bstr.length,
        u8arr = new Uint8Array(n);

      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }

      return new File([u8arr], filename, {type: mime});
    };

    const valueAppendToImage = (image) => {

      let file_name = 'dummy'+getRndInteger(100001,999999)+'.png'
      let file = dataURLtoFile(
        image,
        file_name,
      );

      console.log(file )

      values.bunk_reading = file
    }

    // will hold a reference for our real input file
    let inputFile = '';

    // function to trigger our input file click
    const uploadClick = e => {
      e.preventDefault();
      inputFile.click();
      return false;
    };

  const getRndInteger = (min, max) => {
      return Math.floor(Math.random() * (max - min)) + min;
    }

    useEffect(() => {

      if(values.bunk_reading) {
        setFileuploaded(true)
      } else {
        setFileuploaded(false)
      }

    }, [values.bunk_reading])
      /* ==================== Bunk Reading Image ReSize End ========================*/

      /* ====================Invoice Copy Web Cam Start ========================*/

    const webcamRef1 = React.useRef(null);
    const [fileuploaded1, setFileuploaded1] = useState(false)
    const [camEnable1, setCamEnable1] = useState(false)
    const [imgSrc1, setImgSrc1] = React.useState(null);


    /* ============= Admin Vendor Change Process ============= */

    const [vendorChangeId, setVendorChangeId] = useState('')

    const AdminVendorChange = (eve) => {
      let selectedValue = eve.target.value
      console.log(selectedValue,'AdminVendorChange-selectedValue')
      setVendorChangeId(selectedValue)
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

    function DieselVendorChange() {

      if(vendorChangeId == ''){ 
        toast.warning('Vendor Name is required...')
        return false
      } 

      if(values.diesel_vendor_id == vendorChangeId){
        toast.warning('Same Vendor cannot be updated itself...')
        return false
      }
      
      const data = new FormData() 
      data.append('parking_id', values.parking_id)
      data.append('di_id', id) 
      data.append('diesel_vendor_id', values.diesel_vendor_id)
      data.append('change_vendor_id', vendorChangeId)  
      setFetch(false)

      DieselIntentCreationService.adminUpdateDieselVendor(data).then((res) => {
        console.log(res,'adminUpdateDieselVendor-response')
        setFetch(true)
        if (res.status === 200) {
          toast.success(res.data.message)
          navigation('/DIConfirmationHome')
        } else if (res.status === 201) {
          toast.warning(res.data.message)
        } else {
          toast.warning('Something went wrong!')
        } 
      })
      .catch((error) => {
        setFetch(true)
        var object = error.response.data.errors
        var output = ''
        for (var property in object) {
          output += '*' + object[property] + '\n'
        }
        setError(output)
        setErrorModal(true)
      })
    }

    /* ============= Admin Vendor Change Process ============= */

    const capture1 = React.useCallback(() => {
      const imageSrc1 = webcamRef1.current.getScreenshot();
      setImgSrc1(imageSrc1);
    }, [webcamRef1, setImgSrc1]);
   /* ====================Invoice Copy Reading Web Cam End ========================*/

   /* ==================== Invoice Copy Image ReSize Start ========================*/

    const resizeFile1 = (file) => new Promise(resolve => {
      FileResizer.imageFileResizer(file, 1000, 1000, 'JPEG', 100, 0,
      uri => {
        resolve(uri);
      }, 'base64' );
    })

    const imageCompress1 = async (event) => {
      const file = event.target.files[0];
      console.log(file)

      if(file.type == 'application/pdf') {

      if(file.size > 5000000){
        alert('File too Big, please select a file less than 5mb')
        setFileuploaded1(false)
      } else {
        values.invoice_copy = file
        setFileuploaded1(true)
      }
    }else{

      const image = await resizeFile1(file);
      if(file.size > 2000000){ // Condition Set only for compress more than 2mb files
        valueAppendToImage1(image)
        setFileuploaded1(true)
      } else {
        values.invoice_copy = file
        setFileuploaded1(true)
      }
    }
  }

    const dataURLtoFile1 = (dataurl, filename) => {
      var arr = dataurl.split(','),
        mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]),
        n = bstr.length,
        u8arr = new Uint8Array(n);

      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }

      return new File([u8arr], filename, {type: mime});
    };

    const valueAppendToImage1 = (image) => {

      let file_name = 'dummy'+getRndInteger1(100001,999999)+'.png'
      let file = dataURLtoFile1(
        image,
        file_name,
      );

      console.log(file)

      values.invoice_copy = file
    }

    // will hold a reference for our real input file
    let inputFile1 = '';

    // function to trigger our input file click
    const uploadClick1 = e => {
      e.preventDefault();
      inputFile1.click();
      return false;
    };

  const getRndInteger1 = (min, max) => {
      return Math.floor(Math.random() * (max - min)) + min;
    }

    useEffect(() => {

      if(values.invoice_copy) {
        setFileuploaded1(true)
      } else {
        setFileuploaded1(false)
      }

    }, [values.invoice_copy])

   /* ==================== Invoice Copy Image ReSize End ========================*/


  function CreateDieselIntent(status) {
    console.log(values)
    const data = new FormData()
    console.log(values)
    data.append('_method', 'PUT')
    data.append('vehicle_id', values.vehicle_id)
    data.append('parking_id', values.parking_id)
    data.append('driver_id', values.driver_id)
    data.append('diesel_vendor_id', values.diesel_vendor_id)
    data.append('vendor_code', values.vendor_code)
    data.append('tripsheet_id', values.tripsheet_id)
    data.append('no_of_ltrs', values.no_of_ltrs.toFixed(3))
    data.append('invoice_no', values.invoice_no)
    data.append('invoice_copy', values.invoice_copy)
    data.append('total_amount', values.total_amount)
    data.append('bunk_reading', values.bunk_reading)
    data.append('rate_of_ltrs', values.rate_of_ltrs)
    data.append('diesel_invoice_date', values.diesel_invoice_date)
    data.append('confirmation_remarks', values.remarks)
    data.append('confirmed_by', user_id)
    data.append('diesel_status', status)    

    let p = 200;

    if (p <= values.rate_of_ltrs) {
      setFetch(true)
      toast.warning('Rate per liter should not allow more than 200Rs...')
      return false
    }else if(values.invoice_copy == '' || values.invoice_copy.size > 5000000){
      setFetch(true)
      toast.warning('Attach The  Invoice Copy Less Than 5MB')
      return false
    }else if(values.bunk_reading == '' || values.bunk_reading.size > 5000000){
      setFetch(true)
      toast.warning('Attach The Bunk Reading Copy Less Than 5MB')
      return false
    }

    DieselIntentCreationService.updateDiesel(id, data)
      .then((res) => {
        if (res.status === 200) {
          if (status == 2) {
            setFetch(true)
            toast.success('Diesel Intent Confirmed Successfully!')
            navigation('/DIConfirmationHome')
          } else {
            setFetch(true)
            toast.warning('Reject the Diesel Confirmation!')
            navigation('/DIConfirmationHome')
          }
        }
      })
      .catch((error) => {
        setFetch(true)
        var object = error.response.data.errors
        var output = ''
        for (var property in object) {
          output += '*' + object[property] + '\n'
        }
        setError(output)
        setErrorModal(true)
      })
  }
  function CreateDieselIntentOwn(status) {
    console.log(values)
    const data = new FormData()
    console.log(values)
    data.append('_method', 'PUT')
    data.append('vehicle_id', values.vehicle_id)
    data.append('parking_id', values.parking_id)
    data.append('driver_id', values.driver_id)
    data.append('diesel_vendor_id', values.diesel_vendor_id)
    data.append('vendor_code', values.vendor_code)
    data.append('tripsheet_id', values.tripsheet_id)
    data.append('no_of_ltrs', values.no_of_ltrs1)
    data.append('invoice_no', values.invoice_no)
    data.append('invoice_copy', values.invoice_copy)
    data.append('total_amount', values.total_amount1.toFixed(0))
    data.append('bunk_reading', values.bunk_reading)
    data.append('rate_of_ltrs', values.rate_of_ltrs1)
    data.append('diesel_invoice_date', values.diesel_invoice_date)
    data.append('confirmation_remarks', values.remarks)
    data.append('confirmed_by', user_id)
    data.append('diesel_status', status)    

    let p = 200;

    if (p <= values.rate_of_ltrs1) {
      setFetch(true)
      toast.warning('Rate per liter should not allow more than 200Rs...')
      return false
    }else if(values.invoice_copy == '' || values.invoice_copy.size > 5000000){
      setFetch(true)
      toast.warning('Attach The  Invoice Copy Less Than 5MB')
      return false
    }else if(values.bunk_reading == '' || values.bunk_reading.size > 5000000){
      setFetch(true)
      toast.warning('Attach The Bunk Reading Copy Less Than 5MB')
      return false
    }

    DieselIntentCreationService.updateDiesel(id, data)
      .then((res) => {
        if (res.status === 200) {
          if (status == 2) {
            setFetch(true)
            toast.success('Diesel Intent Confirmed Successfully!')
            navigation('/DIConfirmationHome')
          } else {
            setFetch(true)
            toast.warning('Reject the Diesel Confirmation!')
            navigation('/DIConfirmationHome')
          }
        }
      })
      .catch((error) => {
        setFetch(true)
        var object = error.response.data.errors
        var output = ''
        for (var property in object) {
          output += '*' + object[property] + '\n'
        }
        setError(output)
        setErrorModal(true)
      })
  }
  /*This is for total amount multiflication*/
  useEffect(() => {
    if (values.total_amount && values.rate_of_ltrs) {
      isTouched.total_amount = true
      values.no_of_ltrs = Number(values.total_amount) / Number(values.rate_of_ltrs)
    } else {
      values.no_of_ltrs = ''
    }
  })
  useEffect(() => {
    if (values.no_of_ltrs1 && values.rate_of_ltrs1) {
      isTouched.total_amount = true
      values.total_amount1 = Number(values.no_of_ltrs1) * Number(values.rate_of_ltrs1)
    } else {
      values.total_amount1 = ''
    }
  })
  useEffect(() => {
    if (Object.keys(errors).length === 0 && Object.keys(isTouched)) {
      setValidateSubmit(false)
    } else {
      setValidateSubmit(true)
    }

    console.log(singleVehicleInfo)
    console.log(values)
  })
  useEffect(() => {
    if (
      isTouched.invoice_no &&
      !errors.invoice_no &&
      // isTouched.invoice_copy &&
      !errors.diesel_invoice_date &&
      isTouched.diesel_invoice_date &&
      !errors.invoice_copy &&
      // isTouched.bunk_reading &&
      isTouched.rate_of_ltrs &&
      !errors.rate_of_ltrs &&
      !errors.bunk_reading
    ) {
      setAcceptBtn(false)
    } else {
      setAcceptBtn(true)
    }
  }, [errors])
  useEffect(() => {
    if (
      !errors.no_of_ltrs1&&
      isTouched.invoice_no &&
      !errors.invoice_no &&
      // isTouched.invoice_copy &&
      !errors.invoice_copy &&
      !errors.diesel_invoice_date &&
      isTouched.diesel_invoice_date &&
      // isTouched.bunk_reading &&
      isTouched.rate_of_ltrs1 &&
      !errors.rate_of_ltrs1 &&
      !errors.bunk_reading
    ) {
      setAcceptBtn1(false)
    } else {
      setAcceptBtn1(true)
    }
  }, [errors])
  return (
    <>
      {!fetch && <Loader />}
      {fetch && (
       <>
        {screenAccess ? (
         <>
          <CCard>
            <CTabContent>
              <CTabPane role="tabpanel" aria-labelledby="home-tab" visible={true}>
                <CForm className="container p-3" onSubmit={handleSubmit}>
                  <CRow className="">
                    {/* <CCol xs={12} md={3}>
                    <CFormLabel htmlFor="inputAddress">VA Number</CFormLabel>

                  <CFormInput size="sm" id="inputAddress"  readOnly />
                </CCol> */}

                  <CCol xs={12} md={3}>
                    <CFormLabel htmlFor="vNum">Vehicle Number</CFormLabel>
                    <CFormInput
                      size="sm"
                      id="vNum"
                      value={values.vehicle_number}
                      readOnly
                    />
                  </CCol>
                  <CCol xs={12} md={3}>
                    <CFormLabel htmlFor="tripsheet_id">Trip Sheet Number</CFormLabel>
                    <CFormInput
                      size="sm"
                      // name="tripsheet_sheet_id"
                      onFocus={onFocus}
                      onBlur={onBlur}
                      onChange={handleChange}
                      value={values.trip_sheet_no}
                      // value={singleVehicleInfo.trip_sheet_info.trip_sheet_no}
                      // id="tripsheet_id"
                      type="text"
                      readOnly
                    />
                  </CCol>
                  <CCol xs={12} md={3}>
                    <CFormLabel htmlFor="diesel_vendor_name">Vendor Name</CFormLabel>
                    <CFormInput
                      size="sm"
                      name="diesel_vendor_name"
                      onFocus={onFocus}
                      onBlur={onBlur}
                      onChange={handleChange}
                      id="diesel_vendor_name"
                      value={values.diesel_vendor_name}
                      readOnly
                    />
                  </CCol>
                  <CCol xs={12} md={3}>
                    <CFormLabel htmlFor="vCode">Vendor Code</CFormLabel>

                    <CFormInput size="sm" id="vNum" value={values.vendor_code} readOnly />
                  </CCol>
                  <CCol xs={12} md={3}>
                    <CFormLabel htmlFor="diesel_invoice_date">
                      Invoice Date <REQ />{' '}
                      {errors.diesel_invoice_date && (
                        <span className="small text-danger">{errors.diesel_invoice_date}</span>
                      )}
                    </CFormLabel>
                    <CFormInput
                      size="sm"
                      type="date"
                      name="diesel_invoice_date"
                      id="diesel_invoice_date"
                      onFocus={onFocus}
                      onBlur={onBlur}
                      onChange={handleChange}
                      value={values.diesel_invoice_date}
                    />
                 </CCol>
                  <CCol xs={12} md={3}>
                    <CFormLabel htmlFor="invoice_no">
                      Invoice Number <REQ />{' '}
                      {errors.invoice_no && (
                        <span className="help text-danger">{errors.invoice_no}</span>
                      )}
                    </CFormLabel>
                    <CFormInput
                      name="invoice_no"
                      onFocus={onFocus}
                      onBlur={onBlur}
                      onChange={handleChange}
                      className={`${errors.invoice_no && 'is-invalid'}`}
                      size="sm"
                      id="invoice_no"
                      value={values.invoice_no}
                      maxLength={15}
                    />
                  </CCol>
                  <CCol xs={12} md={3}>
                    <CFormLabel htmlFor="invoice_copy">
                      Invoice Copy <REQ />{' '}
                      {errors.invoice_copy && (
                        <span className="help text-danger">{errors.invoice_copy}</span>
                      )}
                    </CFormLabel>
                      <CButton className="w-100 m-0" color="info" size="sm" id="inputAddress">
                          {!fileuploaded1 ? (
                            <>
                              <span className="float-start" onClick={uploadClick1}>
                                <CIcon
                                  style={{color:'red'}}
                                  icon={icon.cilFolderOpen}
                                  size="lg"
                                />
                                &nbsp;Upload
                              </span>
                              <span
                                style={{marginRight:'10%'}}
                                className="mr-10 float-end"
                                onClick={() => {
                                  setCamEnable1(true)
                                }}
                              >
                                <CIcon
                                    style={{color:'red'}}
                                    icon={icon.cilCamera}
                                    size="lg"
                                  />
                                &nbsp;Camera
                              </span>
                            </>
                          ) : (
                            <>
                              <span className="float-start">
                                &nbsp;{values.invoice_copy.name}
                              </span>
                              <span className="float-end">
                                <i
                                  className="fa fa-trash"
                                  aria-hidden="true"
                                  onClick={() => {
                                    setFileuploaded1(false)
                                    values.invoice_copy == ''
                                  }}
                                ></i>
                              </span>
                            </>
                          )}
                      </CButton>
                      <CFormInput
                        type="file"
                        name="invoice_copy"
                        onFocus={onFocus}
                        onBlur={onBlur}
                        onChange={(e)=>{imageCompress1(e)}}
                        className={`${errors.invoice_copy && 'is-invalid'}`}
                        size="sm"
                        id="invoice_copy"
                        accept=".jpg,.jpeg,.png,.pdf"
                        style={{display:'none'}}
                        ref={input1 => {
                            // assigns a reference so we can trigger it later
                            inputFile1 = input1;
                        }}
                      />
                    </CCol>
                    {/* </CRow>
                <CRow className=""> */}
                    {values.vehicle_type_id == 3 && (
                      <CCol xs={12} md={3}>
                        <CFormLabel htmlFor="total_amount">Amount</CFormLabel>
                        <CFormInput
                          name="total_amount"
                          onFocus={onFocus}
                          onBlur={onBlur}
                          size="sm"
                          value={values.total_amount}
                          id="total_amount"
                          readOnly
                        />
                      </CCol>
                    )}
                    {values.vehicle_type_id != 3 && (
                    <CCol xs={12} md={3}>
                      <CFormLabel htmlFor="rate_of_ltrs1">
                        Rate Per Liter <REQ />{' '}
                        {errors.rate_of_ltrs1 && (
                          <span className="help text-danger">{errors.rate_of_ltrs1}</span>
                        )}
                      </CFormLabel>
                      <CFormInput
                        name="rate_of_ltrs1"
                        onFocus={onFocus}
                        onBlur={onBlur}
                        onChange={handleChange}
                        className={`${errors.rate_of_ltrs1 && 'is-invalid'}`}
                        value={values.rate_of_ltrs1}
                        size="sm"
                        id="rate_of_ltrs1"
                        maxLength={6}
                      />
                    </CCol>)}
                    {values.vehicle_type_id != 3 && (
                    <CCol xs={12} md={3}>
                      <CFormLabel htmlFor="no_of_ltrs1">
                        No. Of Liters <REQ />{' '}
                        {errors.no_of_ltrs1 && (
                          <span className="help text-danger">{errors.no_of_ltrs1}</span>
                        )}
                      </CFormLabel>
                      <CFormInput
                        size="sm"
                        name="no_of_ltrs1"
                        onFocus={onFocus}
                        onBlur={onBlur}
                        onChange={handleChange}
                        id="no_of_ltrs1"
                        // value={(formatter.format(values.no_of_ltrs))}
                        value={values.no_of_ltrs1}
                        maxLength={7}
                      />
                    </CCol>)}
                    {values.vehicle_type_id != 3 && (
                      <CCol xs={12} md={3}>
                        <CFormLabel htmlFor="total_amount1">
                          Amount
                          {/* {errors.total_amount && (
                            <span className="help text-danger">{errors.total_amount}</span>
                          )} */}
                        </CFormLabel>
                        <CFormInput
                          name="total_amount1"
                          onFocus={onFocus}
                          onBlur={onBlur}
                          onChange={handleChange}
                          size="sm"
                          value={(formatter1.format(isFinite(values.total_amount1) ? values.total_amount1 : 0))}
                          id="total_amount1"
                          maxLength={6}
                          readOnly
                        />
                      </CCol>
                    )}
                    {values.vehicle_type_id === 3 && (
                    <CCol xs={12} md={3}>
                      <CFormLabel htmlFor="rate_of_ltrs">
                        Rate Per Liter <REQ />{' '}
                        {errors.rate_of_ltrs && (
                          <span className="help text-danger">{errors.rate_of_ltrs}</span>
                        )}
                      </CFormLabel>
                      <CFormInput
                        name="rate_of_ltrs"
                        onFocus={onFocus}
                        onBlur={onBlur}
                        onChange={handleChange}
                        className={`${errors.rate_of_ltrs && 'is-invalid'}`}
                        value={values.rate_of_ltrs}
                        size="sm"
                        id="rate_of_ltrs"
                        maxLength={6}
                      />
                    </CCol>)}
                    {values.vehicle_type_id === 3 && (
                    <CCol xs={12} md={3}>
                      <CFormLabel htmlFor="no_of_ltrs">
                        No. Of Liters <REQ />{' '}
                      </CFormLabel>
                      <CFormInput
                        size="sm"
                        name="no_of_ltrs"
                        onFocus={onFocus}
                        onBlur={onBlur}
                        onChange={handleChange}
                        id="no_of_ltrs"
                        // value={(formatter.format(values.no_of_ltrs))}
                        value={formatter.format(
                          isFinite(values.no_of_ltrs) ? values.no_of_ltrs : 0.0
                        )}
                        maxLength={7}
                        readOnly
                      />
                    </CCol>)}
                    <CCol xs={12} md={3}>
                      <CFormLabel htmlFor="bunk_reading">
                        Bunk Reading <REQ />{' '}
                        {errors.bunk_reading && (
                          <span className="help text-danger">{errors.bunk_reading}</span>
                        )}
                      </CFormLabel>
                      <CButton className="w-100 m-0" color="info" size="sm" id="inputAddress">
                          {!fileuploaded ? (
                            <>
                              <span className="float-start" onClick={uploadClick}>
                                <CIcon
                                  style={{color:'red'}}
                                  icon={icon.cilFolderOpen}
                                  size="lg"
                                />
                                &nbsp;Upload
                              </span>
                              <span
                                style={{marginRight:'10%'}}
                                className="mr-10 float-end"
                                onClick={() => {
                                  setCamEnable(true)
                                }}
                              >
                                <CIcon
                                    style={{color:'red'}}
                                    icon={icon.cilCamera}
                                    size="lg"
                                  />
                                &nbsp;Camera
                              </span>
                            </>
                          ) : (
                            <>
                              <span className="float-start">
                                &nbsp;{values.bunk_reading.name}
                              </span>
                              <span className="float-end">
                                <i
                                  className="fa fa-trash"
                                  aria-hidden="true"
                                  onClick={() => {
                                    setFileuploaded(false)
                                    values.bunk_reading == ''
                                  }}
                                ></i>
                              </span>
                            </>
                          )}
                        </CButton>
                      <CFormInput
                        type="file"
                        name="bunk_reading"
                        onFocus={onFocus}
                        onBlur={onBlur}
                        onChange={(e)=>{imageCompress(e)}}
                        className={`${errors.bunk_reading && 'is-invalid'}`}
                        size="sm"
                        id="bunk_reading"
                        accept=".jpg,.jpeg,.png,.pdf"
                        style={{display:'none'}}
                        ref={input => {
                            // assigns a reference so we can trigger it later
                            inputFile = input;
                        }}
                      />
                    </CCol>
                    <CCol xs={12} md={3}>
                      <CFormLabel htmlFor="remarks">Remarks</CFormLabel>
                      <CFormTextarea
                        id="remarks"
                        name="remarks"
                        onChange={handleChange}
                        value={values.remarks}
                        rows="1"
                      ></CFormTextarea>
                    </CCol>
                  </CRow>

                  {/* Admin - Diesel Vendor Change Process */}
                  {user_info.is_admin == 1 && 
                    <>  
                      <ColoredLine color="red" />
                      <CRow className="mt-md-3">
                        
                        <CCol className="" xs={12} sm={12} md={3}>
                          <CFormLabel htmlFor="diesel_vendor_name">
                            Vendor Name  
                          </CFormLabel>
                          <CFormSelect
                            size="sm"
                            name="dvname" 
                            onChange={(e)=>{AdminVendorChange(e)}}
                            value={vendorChangeId}
                            id="vendor_id" 
                            aria-label="Small select example"
                          >
                            <DieseVendorSelectComponent/>
                          </CFormSelect> 
                        </CCol>
                        {vendorChangeId &&
                          <CCol className="mt-4" xs={12} sm={12} md={3}>
                            <CButton 
                              size="sm" 
                              color="success" 
                              className="text-white" 
                              type="button" 
                              onClick={() => {
                                DieselVendorChange() 
                              }}> 
                                Vendor Change 
                            </CButton> 

                          </CCol>
                        }   
                      </CRow>
                      <ColoredLine color="red" />
                    </>
                  }
                
                {values.vehicle_type_id === vehicleType.OWN ||
                 values.vehicle_type_id === vehicleType.CONTRACT ? (
                <CRow className="mt-md-3">
                  <CCol className="" xs={12} sm={12} md={3}>
                    <CButton size="sm" color="primary" className="text-white" type="button">
                      <Link className="text-white" to="/DiConfirmationHome">
                        Previous
                      </Link>
                    </CButton>
                  </CCol>
                  <CCol
                    className="offset-md-6"
                    xs={12}
                    sm={12}
                    md={3}
                    style={{ display: 'flex', justifyContent: 'end' }}
                  >
                    <CButton
                      size="sm"
                      color="warning"
                      className="mx-3 px-3 text-white"
                      // type="button"
                      disabled={acceptBtn1}
                      onClick={() => {
                        setFetch(false)
                        CreateDieselIntentOwn(2)
                      }}
                      // type="submit"
                    >
                      Submit
                    </CButton>
                  </CCol>
                </CRow>
              ) : (
                <CRow className="mt-md-3">
                  <CCol className="" xs={12} sm={12} md={3}>
                    <CButton size="sm" color="primary" className="text-white" type="button">
                      <Link className="text-white" to="/DiConfirmationHome">
                        Previous
                      </Link>
                    </CButton>
                  </CCol>
                  <CCol
                    className="offset-md-6"
                    xs={12}
                    sm={12}
                    md={3}
                    style={{ display: 'flex', justifyContent: 'end' }}
                  >
                    <CButton
                      size="sm"
                      color="warning"
                      className="mx-3 px-3 text-white"
                      // type="button"
                      disabled={acceptBtn}
                      onClick={() => {
                        setFetch(false)
                        CreateDieselIntent(2)
                      }}
                      // type="submit"
                    >
                      Submit
                    </CButton>
                  </CCol>
                </CRow>
              )}

                </CForm>
              </CTabPane>
            </CTabContent>
          </CCard>
         </>) : (<AccessDeniedComponent />)}
       </>
      )}
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
      {/*Camera Image Copy model*/}
      <CModal
              visible={camEnable}
              backdrop="static"
              onClose={() => {
                setCamEnable(false)
                setImgSrc("")
              }}
            >
              <CModalHeader>
                <CModalTitle>Bunk Reading Photo</CModalTitle>
              </CModalHeader>
              <CModalBody>

                {!imgSrc && (
                  <>
                    <Webcam
                      audio={false}
                      ref={webcamRef}
                      screenshotFormat="image/png"
                      height={200}
                    />
                    <p className='mt-2'>
                      <CButton
                        size="sm"
                        color="warning"
                        className="mx-1 px-2 text-white"
                        type="button"
                        onClick={() => {
                          capture()
                        }}
                      >
                        Accept
                      </CButton>
                    </p>
                  </>
                )}
                {imgSrc && (

                  <>
                    <img height={200}
                      src={imgSrc}
                    />
                    <p className='mt-2'>
                      <CButton
                        size="sm"
                        color="warning"
                        className="mx-1 px-2 text-white"
                        type="button"
                        onClick={() => {
                          setImgSrc("")
                        }}
                      >
                        Delete
                      </CButton>
                    </p>
                  </>
                )}

              </CModalBody>
              <CModalFooter>
                {imgSrc && (
                  <CButton
                    className="m-2"
                    color="warning"
                    onClick={() => {
                      setCamEnable(false)
                      valueAppendToImage(imgSrc)
                    }}
                  >
                    Confirm
                  </CButton>
                )}
                <CButton
                  color="secondary"
                  onClick={() => {
                    setCamEnable(false)
                    setImgSrc("")
                  }}
                >
                  Cancel
                </CButton>
              </CModalFooter>
      </CModal>

      <CModal
              visible={camEnable1}
              backdrop="static"
              onClose={() => {
                setCamEnable1(false)
                setImgSrc1("")
              }}
            >
              <CModalHeader>
                <CModalTitle>Invoice Copy Photo</CModalTitle>
              </CModalHeader>
              <CModalBody>

                {!imgSrc1 && (
                  <>
                    <Webcam
                      audio={false}
                      ref={webcamRef1}
                      screenshotFormat="image/png"
                      height={200}
                    />
                    <p className='mt-2'>
                      <CButton
                        size="sm"
                        color="warning"
                        className="mx-1 px-2 text-white"
                        type="button"
                        onClick={() => {
                          capture1()
                        }}
                      >
                        Accept
                      </CButton>
                    </p>
                  </>
                )}
                {imgSrc1 && (

                  <>
                    <img height={200}
                      src={imgSrc1}
                    />
                    <p className='mt-2'>
                      <CButton
                        size="sm"
                        color="warning"
                        className="mx-1 px-2 text-white"
                        type="button"
                        onClick={() => {
                          setImgSrc1("")
                        }}
                      >
                        Delete
                      </CButton>
                    </p>
                  </>
                )}

              </CModalBody>
              <CModalFooter>
                {imgSrc1 && (
                  <CButton
                    className="m-2"
                    color="warning"
                    onClick={() => {
                      setCamEnable1(false)
                      valueAppendToImage1(imgSrc1)
                    }}
                  >
                    Confirm
                  </CButton>
                )}
                <CButton
                  color="secondary"
                  onClick={() => {
                    setCamEnable1(false)
                    setImgSrc1("")
                  }}
                >
                  Cancel
                </CButton>
              </CModalFooter>
      </CModal>
      {/*Camera Image Copy model*/}
    </>
  )
}

export default DiIntentConfirmation
