import {
  CButton,
  CCard,
  CContainer,
  CCol,
  CRow,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CCardImage,
  CModalFooter,
} from '@coreui/react'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import CustomTable from 'src/components/customComponent/CustomTable'
import Loader from 'src/components/Loader'
import DriverMasterService from 'src/Service/Master/DriverMasterService'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import CustomSpanButton from 'src/components/customComponent/CustomSpanButton1'
import * as XLSX from 'xlsx';
import FileSaver from 'file-saver'
import { GetDateTimeFormat } from 'src/Pages/Depo/CommonMethods/CommonMethods'
import JavascriptInArrayComponent from 'src/components/commoncomponent/JavascriptInArrayComponent'
import * as LogisticsProScreenNumberConstants from 'src/components/constants/LogisticsProScreenNumberConstants'
import AccessDeniedComponent from 'src/components/commoncomponent/AccessDeniedComponent'

const DriverMasterTableData = () => {
  const [LicenseCopyFront, setLicenseCopyFront] = useState(false)
  const [LicenseCopyBack, setLicenseCopyBack] = useState(false)
  const [AadharCopy, setAadharCopy] = useState(false)
  const [PanCopy, setPanCopy] = useState(false)
  const [fetch, setFetch] = useState(false)
  const [DriverPhoto, setDriverPhoto] = useState(false)

  const [rowData, setRowData] = useState([])
  const [mount, setMount] = useState(1)
  
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
      let page_no_for_view_access = LogisticsProScreenNumberConstants.MasterAccessModule.Driver_Master_View
      let page_no_for_edit_access = LogisticsProScreenNumberConstants.MasterAccessModule.Driver_Master_Edit
  
      const edit_access = JavascriptInArrayComponent(page_no_for_edit_access,user_info.page_permissions)
    
      useEffect(()=>{
    
        if(user_info.is_admin == 1 || JavascriptInArrayComponent(page_no_for_view_access,user_info.page_permissions)){
          console.log('screen-access-allowed')
          setScreenAccess(true)
        } else{
          console.log('screen-access-not-allowed')
          setScreenAccess(false)
        }
    
      },[])
    /* ==================== Access Part End ========================*/

  const [documentSrc, setDocumentSrc] = useState('')
  let viewData

  function changeDriverStatus(id) {
    DriverMasterService.deleteDrivers(id).then((res) => {
      toast.success('Driver Active Status Updated Successfully!')
      setMount((preState) => preState + 1)
    })
  }

  function changeDriverAssignStatus(id) {
    DriverMasterService.muteDrivers(id).then((res) => {
      toast.success('Driver Assign Status Updated Successfully!')
      setMount((preState) => preState + 1)
    })
  }

  //section for handling view model for each model

  function handleViewDocuments(e, id, type) {
    switch (type) {
      case 'LC_FRONT':
        {
          let singleDriverInfo = viewData.filter((data) => data.driver_id == id)
          // console.log(viewData)
          setDocumentSrc(singleDriverInfo[0].license_copy_front)
          setLicenseCopyFront(true)
        }
        break
      case 'LC_BACK':
        {
          let singleDriverInfo = viewData.filter((data) => data.driver_id == id)
          setDocumentSrc(singleDriverInfo[0].license_copy_back)
          setLicenseCopyBack(true)
        }
        break
      case 'AADHAR_COPY':
        {
          let singleDriverInfo = viewData.filter((data) => data.driver_id == id)
          setDocumentSrc(singleDriverInfo[0].aadhar_card)
          setAadharCopy(true)
        }
        break
      case 'PAN_COPY':
        {
          let singleDriverInfo = viewData.filter((data) => data.driver_id == id)
          setDocumentSrc(singleDriverInfo[0].pan_card)
          setPanCopy(true)
        }
        break
      case 'DRIVER_COPY':
        {
          let singleDriverInfo = viewData.filter((data) => data.driver_id == id)
          setDocumentSrc(singleDriverInfo[0].driver_photo)
          setDriverPhoto(true)
        }
        break
    }
  }

  const exportToCSV = () => {
    let dateTimeString = GetDateTimeFormat(1)
    let fileName='Driver_Master_Report_'+dateTimeString
    const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    const fileExtension = '.xlsx';
    const ws = XLSX.utils.json_to_sheet(rowData);
    const wb = { Sheets: { 'data': ws }, SheetNames: ['data'] };
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], {type: fileType});
    FileSaver.saveAs(data, fileName + fileExtension);
  }

  useEffect(() => {
    DriverMasterService.getDrivers().then((response) => {
      setFetch(true)
      viewData = response.data.data
      // console.log(viewData)
      let rowDataList = []
      viewData.map((data, index) => {
        rowDataList.push({
          sno: index + 1,
          Creation_Date: data.created_at,
          Driver_Type: data.driver_type_info.driver_type,
          Driver_Name: data.driver_name,
          Driver_Code: data.driver_code,
          Driver_Phone1: data.driver_phone_1,
          Driver_Phone2: data.driver_phone_2,
          License_Number: data.license_no,
          License_Valid_To: data.license_validity_to,
          LC_Copy_Front: (
            <CustomSpanButton
              handleViewDocuments={handleViewDocuments}
              driverId={data.driver_id}
              documentType={'LC_FRONT'}
            />
          ),
          LC_Copy_Back: (
            <CustomSpanButton
              handleViewDocuments={handleViewDocuments}
              driverId={data.driver_id}
              documentType={'LC_BACK'}
            />
          ),
          License_Validity: data.license_validity_status === 1 ? 'Valid' : 'Invalid',
          Aadhar_Copy: (
            <CustomSpanButton
              handleViewDocuments={handleViewDocuments}
              driverId={data.driver_id}
              documentType={'AADHAR_COPY'}
            />
          ),
          Pan_Copy: (
            <CustomSpanButton
              handleViewDocuments={handleViewDocuments}
              driverId={data.driver_id}
              documentType={'PAN_COPY'}
            />
          ),
          Driver_Copy: (
            <CustomSpanButton
              handleViewDocuments={handleViewDocuments}
              driverId={data.driver_id}
              documentType={'DRIVER_COPY'}
            />
          ),
          Driver_Address: data.driver_address,
          Assigned_Status: data.driver_assigned_status === 1 ? '✔️' : '❌',
          Status: data.driver_status === 1 ? '✔️' : '❌',
          Action: (
            (user_info && user_info.is_admin == 1) || edit_access ? (
              <div className="d-flex justify-content-space-between">
                <CButton
                  size="sm"
                  color={data.driver_assigned_status === 1 ? 'success' :"danger"}
                  shape="rounded"
                  id={data.id}
                  onClick={() => {
                    changeDriverAssignStatus(data.driver_id)
                  }}
                  className="m-1"
                >
                  {/* Assign */}
                  {data.driver_assigned_status === 1 ? (
                    <i className="fa fa-check" aria-hidden="true"></i>
                  ) : (
                    <i className="fa fa-window-close-o" aria-hidden="true"></i>
                  )}
                  
                </CButton>
                <CButton
                  size="sm"
                  color={data.driver_status === 1 ? 'success' :"danger"}
                  shape="rounded"
                  id={data.id}
                  onClick={() => {
                    changeDriverStatus(data.driver_id)
                  }}
                  className="m-1"
                >
                  {/* Delete */}
                  <i className="fa fa-trash" aria-hidden="true"></i>
                </CButton>
                
                <Link to={data.driver_status === 1 ? `DriverMaster/${data.driver_id}` : ''}>
                  <CButton
                    size="sm"
                    disabled={data.driver_status === 1 ? false : true}
                    color="secondary"
                    shape="rounded"
                    id={data.id}
                    className="m-1"
                  >
                    {/* Edit */}
                    <i className="fa fa-edit" aria-hidden="true"></i>
                  </CButton>
                </Link>
              </div>
            ) : '-'
          ),
        })
      })
      setRowData(rowDataList)
    })
  }, [mount])

  // ============ Column Header Data =======

  const columns = [
    {
      name: 'S.No',
      selector: (row) => row.sno,
      sortable: true,
      center: true,
    },
    {
      name: 'Creation Date',
      selector: (row) => row.Creation_Date,
      sortable: true,
      center: true,
    },
    {
      name: 'Driver Type',
      selector: (row) => row.Driver_Type,
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
      name: 'Driver Code',
      selector: (row) => row.Driver_Code,
      sortable: true,
      center: true,
    },
    {
      name: 'Driver Mobile Number 1',
      selector: (row) => row.Driver_Phone1,
      sortable: true,
      center: true,
    },
    {
      name: 'Driver Mobile Number 2',
      selector: (row) => row.Driver_Phone2,
      sortable: true,
      center: true,
    },
    {
      name: 'License Number',
      selector: (row) => row.License_Number,
      sortable: true,
      center: true,
    },
    {
      name: 'License Valid To',
      selector: (row) => row.License_Valid_To,
      sortable: true,
      center: true,
    },
    {
      name: 'License Validity Status',
      selector: (row) => row.License_Validity,
      sortable: true,
      center: true,
    },
    {
      name: 'License Copy Front',
      selector: (row) => row.LC_Copy_Front,
      center: true,
    },
    {
      name: ' License Copy Back',
      selector: (row) => row.LC_Copy_Back,
      center: true,
    },

    {
      name: 'Aadhar Card',
      selector: (row) => row.Aadhar_Copy,
      center: true,
    },
    {
      name: 'PAN Card',
      selector: (row) => row.Pan_Copy,
      center: true,
    },
    {
      name: 'Driver Photo',
      selector: (row) => row.Driver_Copy,
      center: true,
    },
    {
      name: 'Driver Address',
      selector: (row) => row.Driver_Address,
      sortable: true,
      center: true,
    },
    {
      name: 'Assigned Status',
      selector: (row) => row.Assigned_Status,
      sortable: true,
      center: true,
    },
    {
      name: 'Active Status',
      selector: (row) => row.Status,
      sortable: true,
      center: true,
    },
    {
      name: 'Action',
      selector: (row) => row.Action,
      center: true,
    },
  ]

  //============ column header data=========

  return (
    <>
      {!fetch && <Loader />}
      {fetch && (
        <>
          {screenAccess ? (
            <>
              <CRow className="mt-1 mb-1">
                <CCol
                  className="offset-md-6"
                  xs={15}
                  sm={15}
                  md={6}
                  style={{ display: 'flex', justifyContent: 'end' }}
                >
                  {/* <Link className="text-white" to="/DriverMaster">
                    <CButton size="md" color="warning" className="px-3 text-white" type="button">
                      <span className="float-start">
                        <i className="" aria-hidden="true"></i> &nbsp;NEW
                      </span>
                    </CButton>
                    
                  </Link> */}
                  <CButton
                    size="sm"
                    color="warning"
                    className="px-3 text-white"
                    onClick={(e) => {
                      exportToCSV()
                    }}
                  >
                    EXPORT
                  </CButton>
                </CCol>
              </CRow>
              <CCard>
                <CContainer>
                  <CustomTable
                    columns={columns}
                    data={rowData}
                    // fieldName={'Driver_Name'}
                    showSearchFilter={true}
                  />
                </CContainer>
              </CCard>
              {/*License copy front model*/}
              <CModal visible={LicenseCopyFront} onClose={() => setLicenseCopyFront(false)}>
                <CModalHeader>
                  <CModalTitle>License Copy Front</CModalTitle>
                </CModalHeader>
                <CModalBody>
                  {!documentSrc.includes('.pdf') ? (
                    <CCardImage orientation="top" src={documentSrc} />
                  ) : (
                    <iframe orientation="top" height={500} width={475} src={documentSrc}></iframe>
                  )}
                </CModalBody>
                <CModalFooter>
                  <CButton color="secondary" onClick={() => setLicenseCopyFront(false)}>
                    Close
                  </CButton>
                </CModalFooter>
              </CModal>
              {/*License copy front model*/}
              {/*License copy Back model*/}
              <CModal visible={LicenseCopyBack} onClose={() => setLicenseCopyBack(false)}>
                <CModalHeader>
                  <CModalTitle>License Copy Back</CModalTitle>
                </CModalHeader>
                <CModalBody>
                  {!documentSrc.includes('.pdf') ? (
                    <CCardImage orientation="top" src={documentSrc} />
                  ) : (
                    <iframe orientation="top" height={500} width={475} src={documentSrc}></iframe>
                  )}
                </CModalBody>
                <CModalFooter>
                  <CButton color="secondary" onClick={() => setLicenseCopyBack(false)}>
                    Close
                  </CButton>
                </CModalFooter>
              </CModal>
              {/*License copy Back model*/}
              {/*Aadhar copy model*/}
              <CModal visible={AadharCopy} onClose={() => setAadharCopy(false)}>
                <CModalHeader>
                  <CModalTitle>Aadhar Copy</CModalTitle>
                </CModalHeader>
                <CModalBody>
                  {!documentSrc.includes('.pdf') ? (
                    <CCardImage orientation="top" src={documentSrc} />
                  ) : (
                    <iframe orientation="top" height={500} width={475} src={documentSrc}></iframe>
                  )}
                </CModalBody>
                <CModalFooter>
                  <CButton color="secondary" onClick={() => setAadharCopy(false)}>
                    Close
                  </CButton>
                </CModalFooter>
              </CModal>
              {/*Aadhar copy model*/}
              {/*Pan copy model*/}
              <CModal visible={PanCopy} onClose={() => setPanCopy(false)}>
                <CModalHeader>
                  <CModalTitle>Pan Copy</CModalTitle>
                </CModalHeader>
                <CModalBody>
                  {!documentSrc.includes('.pdf') ? (
                    <CCardImage orientation="top" src={documentSrc} />
                  ) : (
                    <iframe orientation="top" height={500} width={475} src={documentSrc}></iframe>
                  )}
                </CModalBody>
                <CModalFooter>
                  <CButton color="secondary" onClick={() => setPanCopy(false)}>
                    Close
                  </CButton>
                </CModalFooter>
              </CModal>
              {/*Pan copy model*/}
              {/*Driver Photo model*/}
              <CModal visible={DriverPhoto} onClose={() => setDriverPhoto(false)}>
                <CModalHeader>
                  <CModalTitle>Driver Photo</CModalTitle>
                </CModalHeader>
                <CModalBody>
                  {!documentSrc.includes('.pdf') ? (
                    <CCardImage orientation="top" src={documentSrc} />
                  ) : (
                    <iframe orientation="top" height={500} width={475} src={documentSrc}></iframe>
                  )}
                </CModalBody>
                <CModalFooter>
                  <CButton color="secondary" onClick={() => setDriverPhoto(false)}>
                    Close
                  </CButton>
                </CModalFooter>
              </CModal>

              {/*Driver Photo model*/}
            </>) : (<AccessDeniedComponent />
          )}
        </>
      )}
    </>
  )
}

export default DriverMasterTableData
