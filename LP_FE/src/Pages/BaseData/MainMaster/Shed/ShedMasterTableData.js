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
import ShedMaster from 'src/Service/Master/ShedMasterService'
// import ShedMaster from 'src/Pages/Master/ShedMaster/ShedMaster'
import { useNavigate } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import CustomSpanButton from 'src/components/customComponent/CustomSpanButton2'
//validation
import ShedMasterValidation from 'src/Utils/Master/ShedMasterValidation.js'
import { GetDateTimeFormat } from 'src/Pages/Depo/CommonMethods/CommonMethods'
import * as XLSX from 'xlsx';
import FileSaver from 'file-saver'
import JavascriptInArrayComponent from 'src/components/commoncomponent/JavascriptInArrayComponent'
import * as LogisticsProScreenNumberConstants from 'src/components/constants/LogisticsProScreenNumberConstants'
import Loader from 'src/components/Loader'
import AccessDeniedComponent from 'src/components/commoncomponent/AccessDeniedComponent'

const ShedMasterTableData = () => {
  const [ShedOwnerPhoto, setShedOwnerPhoto] = useState(false)
  const [ShedRCcopy, setShedRCcopy] = useState(false)

  const [deleteModal, setDeleteModal] = useState(false)
  const [rowData, setRowData] = useState([])
  const [mount, setMount] = useState(1)
  const [pending, setPending] = useState(true)

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
      let page_no_for_view_access = LogisticsProScreenNumberConstants.MasterAccessModule.Shed_Master_View
      let page_no_for_edit_access = LogisticsProScreenNumberConstants.MasterAccessModule.Shed_Master_Edit
  
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
  function changeShedStatus(id) {
    ShedMaster.deleteShed(id).then((res) => {
      toast.success('Shed Status Updated Successfully!')
      // setMount((preState) => preState + 1)
    })
  }

  const exportToCSV = () => {

    let dateTimeString = GetDateTimeFormat(1)
    let fileName='Shed_Master_Report_'+dateTimeString
    const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    const fileExtension = '.xlsx';
    const ws = XLSX.utils.json_to_sheet(rowData);
    const wb = { Sheets: { 'data': ws }, SheetNames: ['data'] };
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], {type: fileType});
    FileSaver.saveAs(data, fileName + fileExtension);
  }

  //section for handling view model for each model

  function handleViewDocuments(e, id, type) {
    switch (type) {
      case 'SHED_OWNER_PHOTO':
        {
          let singleShedInfo = viewData.filter((data) => data.shed_id == id)
          setDocumentSrc(singleShedInfo[0].shed_owner_photo)
          setShedOwnerPhoto(true)
        }
        break
      case 'RC_BACK':
        {
          let singleVehicleInfo = viewData.filter((data) => data.vehicle_id == id)
          setDocumentSrc(singleVehicleInfo[0].rc_copy_back)
          setShedRCcopy(true)
        }
        break
    }
  }
  useEffect(() => {
    ShedMaster.getShed().then((response) => {
      console.log(response)
      console.log('asd')
      viewData = response.data.data
      let rowDataList = []
      viewData.map((data, index) => {
        rowDataList.push({
          sno: index + 1,
          Creation_Date: data.created_at,
          // Shed_Type: data.shed_type_info.shed_type,
          Shed_Name: data.shed_name,
          Shed_Owner_Name: data.shed_owner_name,
          Shed_Owner_Phone_1: data.shed_owner_phone_1,
          Shed_Owner_Phone_2: data.shed_owner_phone_2 ? data.shed_owner_phone_1 : '-',
          Shed_Owner_Address: data.shed_owner_address,
          Shed_Owner_Photo: (
            <CustomSpanButton
              handleViewDocuments={handleViewDocuments}
              shedId={data.shed_id}
              documentType={'SHED_OWNER_PHOTO'}
            />
          ),
          Aadhar_Number: data.shed_adhar_number ? data.shed_adhar_number : '-',
          Pan_Number: data.pan_number,
          Gst_No: data.gst_no ? data.gst_no : '-',
          Status: data.shed_status === 1 ? '✔️' : '❌',

          Action: (
            (user_info && user_info.is_admin == 1) || edit_access ? (
              <div className="d-flex justify-content-space-between">
                <CButton
                  size="sm"
                  color="danger"
                  shape="rounded"
                  id={data.id}
                  onClick={() => {
                    changeShedStatus(data.shed_id)
                  }}
                  className="m-1"
                >
                  {/* Delete */}
                  <i className="fa fa-trash" aria-hidden="true"></i>
                </CButton>
                <Link to={data.shed_status === 1 ? `ShedMaster/${data.shed_id}` : ''}>
                  <CButton
                    size="sm"
                    color="secondary"
                    shape="rounded"
                    disabled={data.shed_status === 1 ? false : true}
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
      setPending(false)
    })
  }, [])
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
      name: 'Shed Type',
      selector: (row) => row.Shed_Type,
      sortable: true,
      center: true,
    },
    {
      name: 'Shed Name',
      selector: (row) => row.Shed_Name,
      sortable: true,
      center: true,
    },
    {
      name: 'Shed Owner Name',
      selector: (row) => row.Shed_Owner_Name,
      sortable: true,
      center: true,
    },
    {
      name: 'Shed Owner Mobile Number 1',
      selector: (row) => row.Shed_Owner_Phone_1,
      sortable: true,
      center: true,
    },
    {
      name: 'Shed Owner Mobile Number 2',
      selector: (row) => row.Shed_Owner_Phone_2,
      sortable: true,
      center: true,
    },
    {
      name: 'Shed Owner Address',
      selector: (row) => row.Shed_Owner_Address,
      sortable: true,
      center: true,
    },
    {
      name: 'Aadhar Number',
      selector: (row) => row.Aadhar_Number,
      sortable: true,
      center: true,
    },
    {
      name: ' Shed Owner Photo',
      selector: (row) => row.Shed_Owner_Photo,
      center: true,
    },
    {
      name: 'PAN Number',
      selector: (row) => row.Pan_Number,
      sortable: true,
      center: true,
    },
    {
      name: 'GST Number',
      selector: (row) => row.Gst_No,
      sortable: true,
      center: true,
    },
    {
      name: 'Status',
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
                  {/* <Link className="text-white" to="/ShedMaster">
                    <CButton size="sm" color="warning" className="px-5 text-white" type="button">
                      NEW
                    </CButton>
                  </Link> */}
                  <CButton
                    size="sm"
                    color="warning"
                    className="px-5 text-white" 
                    onClick={(e) => {
                      exportToCSV()
                    }
                      }>
                    Export
                  </CButton>
                </CCol>
              </CRow>
              <CCard>
                <CContainer>
                  <CustomTable
                    columns={columns}
                    data={rowData}
                    fieldName={'Shed_Name'}
                    showSearchFilter={true}
                    pending={pending}
                  />
                </CContainer>

                <CModal visible={ShedOwnerPhoto} onClose={() => setShedOwnerPhoto(false)}>
                  <CModalHeader>
                    <CModalTitle>Shed Owner Photo</CModalTitle>
                  </CModalHeader>
                  <CModalBody>
                    <CCardImage orientation="top" src={documentSrc} />
                  </CModalBody>
                  <CModalFooter>
                    <CButton color="secondary" onClick={() => setShedOwnerPhoto(false)}>
                      Close
                    </CButton>
                  </CModalFooter>
                </CModal>
              </CCard>
            </>) : (<AccessDeniedComponent />
          )}
        </>
      )}
    </>
  )
}
export default ShedMasterTableData
