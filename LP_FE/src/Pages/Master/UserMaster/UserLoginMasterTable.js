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
import CustomSpanButton3 from 'src/components/customComponent/CustomSpanButton3'
import Loader from 'src/components/Loader'
import CustomTable from 'src/components/customComponent/CustomTable'
import UserLoginMasterService from 'src/Service/Master/UserLoginMasterService'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import * as XLSX from 'xlsx';
import FileSaver from 'file-saver'
import { GetDateTimeFormat } from 'src/Pages/Depo/CommonMethods/CommonMethods'
import DefinitionsListApi from 'src/Service/Definitions/DefinitionsListApi'
import JavascriptInArrayComponent from 'src/components/commoncomponent/JavascriptInArrayComponent'

const UserLoginMasterTable = () => {
  const [userphoto, setUserphoto] = useState(false)
  const [documentSrc, setDocumentSrc] = useState('')
  const [mount, setMount] = useState(1)
  const [fetch, setFetch] = useState(false)
  const [rowData, setRowData] = useState([])
  const [userPPData, setUserPPData] = useState([])
  const [pending, setPending] = useState(true)
  let viewData

  function handleViewDocuments(e, id, type) {
    switch (type) {
      case 'USER_PHOTO':
        {
          let singleUserInfo = viewData.filter((data) => data.user_id == id)
          setDocumentSrc(singleUserInfo[0].user_image)
          setUserphoto(true)
        }
        break
      default:
        return 0
    }
  }

  const changeUserStatus = (userid) => {
    UserLoginMasterService.deleteUser(userid).then((res) => {
      if (res.status == 204) {
        toast.success('User Status Updated Successfully!')
        setMount((preState) => preState + 1)
      }
    })
  }

  const exportToCSV = () => {

    let dateTimeString = GetDateTimeFormat(1)
    let fileName='User_Master_Report_'+dateTimeString
    const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    const fileExtension = '.xlsx';
    const ws = XLSX.utils.json_to_sheet(rowData);
    const wb = { Sheets: { 'data': ws }, SheetNames: ['data'] };
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], {type: fileType});
    FileSaver.saveAs(data, fileName + fileExtension);
  }

  useEffect(() => {
    DefinitionsListApi.visibleDefinitionsListByDefinition(8).then((response) => {
      let tableData = response.data.data
      console.log(tableData,'setUserPPData')
      const filterData = tableData.filter((data) => (data.definition_list_status == 1))
      setUserPPData(filterData)
    })

  },[])

  useEffect(() => {    
    UserLoginMasterService.getUser().then((res) => {
      setFetch(true)
      viewData = res.data.data
      console.log(viewData,'user_details')
      let rowDataList = []
      viewData.map((data, index) => {
        rowDataList.push({
          sno: index + 1,
          Creation_Date: data.created_at,
          Emp_Id: data.empid,
          emp_name: data.emp_name,
          User_Name: data.username,
          Division: data.division_info.division,
          Department: data.department_info.department,
          Designation: data.designation_info.designation,
          OverAll_Screen_Page_Permissions : ppInfoFinder(data,1),
          Master_Screen_Page_Permissions : ppInfoFinderTypeWise(data,1),
          Transaction_Screen_Page_Permissions : ppInfoFinderTypeWise(data,2),
          Report_Screen_Page_Permissions : ppInfoFinderTypeWise(data,3),
          AssignedVechileType: data.vehicle_types,
          Location: data.location_info
            .filter((location) => location.location_name)
            .map((location) => `${location.location_name} - ${location.location_code}`)
            .join(', '),
            AssignedVechileType: data.vehicle_type_info
            .filter((vehicle_types) => vehicle_types.vehicle_type)
            .map((vehicle_types) => vehicle_types.vehicle_type)
            .join(', '),
          User_ID: data.user_auto_id,
          User_Mobile_Number: data.mobile_no,
          User_Mail_ID: data.email,
          User_Mail_ID: data.email,
          User_Photo: (
            <CustomSpanButton3
              handleViewDocuments={handleViewDocuments}
              Id={data.user_id}
              documentType={'USER_PHOTO'}
            />
          ),
          Status: data.user_status === 1 ? '✔️' : '❌',
          Status_String: data.user_status === 1 ? 'Active' : 'In Active',
          Action: (
            <div className="d-flex justify-content-space-between">
              <CButton
                size="sm"
                color="danger"
                shape="rounded"
                id={data.id}
                onClick={() => {
                  changeUserStatus(data.user_id)
                }}
                className="m-1"
              >
                {/* Delete */}
                <i className="fa fa-trash" aria-hidden="true"></i>
              </CButton>
              <Link to={data.user_status === 1 ? `UserLoginMasterEdit/${data.user_id}` : ''}>
                <CButton
                  disabled={data.user_status === 1 ? false : true}
                  size="sm"
                  color="secondary"
                  shape="rounded"
                  id={data.id}
                  className="m-1"
                  type="button"
                >
                  {/* Edit */}
                  <i className="fa fa-edit" aria-hidden="true"></i>
                </CButton>
              </Link>
            </div>
          ),
        })
      })
      setPending(false)
      setRowData(rowDataList)
    })
  }, [mount,userPPData])

const report_screen_array = [3,5,7,9,13,15,17,19,21,25,27,31,33,35,37,46,47,48,55,56,67,68,80,81,70,73,87,88,89,90,91,92,122,123,124,125,126,137,138,139,140,99,148,149]
const transcation_screen_array = [1,2,4,6,8,10,11,12,14,16,18,20,22,23,24,26,261,28,29,30,32,321,34,36,39,40,41,42,43,44,45,49,50,51,52,53,54,63,64,65,66,69,71,72,74,75,76,77,78,79,82,83,84,85,86,96,97,98,99,100,101,102,103,104,105,106,107,108,109,110,111,112,113,114,115,127,128,129,130,131,132,133,134,135,136,141,143,144,145,146,147,150]
const master_screen_array = [38,48,57,58,59,60,61,62,93,94,95,116,117,118,119,120,121,96,142]

  const ppInfoFinderTypeWise = (data,type) => {
    console.log(data,'ppInfoFinderTypeWise-data')
    let pp_info_array = [] 
    let pp_array = data.page_permissions ? data.page_permissions : []
    if(type === 1){
      pp_array.map((vk1,kk1)=>{      
        if(JavascriptInArrayComponent(vk1,master_screen_array)){          
          userPPData.map((vk,kk)=>{
            if(vk.definition_list_code == vk1){
              let pp = {}
              pp.pp_name = vk.definition_list_name
              pp.pp_code = vk.definition_list_code
              pp.pp_id = vk.definition_list_id
              pp_info_array.push(pp) 
            }
          })
        }       
      })
    } else if(type === 2){
      pp_array.map((vk1,kk1)=>{      
        if(JavascriptInArrayComponent(vk1,transcation_screen_array)){          
          userPPData.map((vk,kk)=>{
            if(vk.definition_list_code == vk1){
              let pp = {}
              pp.pp_name = vk.definition_list_name
              pp.pp_code = vk.definition_list_code
              pp.pp_id = vk.definition_list_id
              pp_info_array.push(pp) 
            }
          })
        }       
      })
    } else if(type === 3){
      pp_array.map((vk1,kk1)=>{      
        if(JavascriptInArrayComponent(vk1,report_screen_array)){          
          userPPData.map((vk,kk)=>{
            if(vk.definition_list_code == vk1){
              let pp = {}
              pp.pp_name = vk.definition_list_name
              pp.pp_code = vk.definition_list_code
              pp.pp_id = vk.definition_list_id
              pp_info_array.push(pp) 
            }
          })
        }       
      })
    } else {

    }
    

    let pp_string = pp_info_array
        .filter((pageP) => pageP.pp_name)       
        .map((pagewP) => `${pagewP.pp_name}`)
        .join(', ')
    console.log(pp_string,'pp_string') 
    if(pp_string == ''){
      return '-'
    }
    return pp_string
  }
  const ppInfoFinder = (data,type) => {
    console.log(data,'ppInfoFinder')
    console.log(userPPData,'ppInfoFinderLP')
    let pp_info_array = [] 
    let pp_array = data.page_permissions
    userPPData.map((vk,kk)=>{
      if(JavascriptInArrayComponent(vk.definition_list_code,pp_array)){
        let pp = {}
        pp.pp_name = vk.definition_list_name
        pp.pp_code = vk.definition_list_code
        pp.pp_id = vk.definition_list_id
        pp_info_array.push(pp) 
      }
    })
    console.log(pp_info_array,'pp_info_array') 
     
    let pp_string = pp_info_array
        .filter((pageP) => pageP.pp_name)       
        .map((pagewP) => `${pagewP.pp_name}`)
        .join(', ')
    console.log(pp_string,'pp_string') 
     // .map((pageP) => `${pageP.pp_code} - ${pageP.pp_name}`)

    if(pp_string == ''){
      return '-'
    }
    if(type == 1){      
      return pp_string
    } else {
      return pp_info_array
    } 
  }

  const columns = [
    {
      name: 'S.No',
      selector: (row) => row.sno,
      sortable: true,
      center: true,
    },

    {
      name: 'Empolyee Name',
      selector: (row) => row.emp_name,
      sortable: true,
      center: true,
    },
        {
      name: 'Empolyee Code',
      selector: (row) => row.Emp_Id,
      sortable: true,
      center: true,
    },

    {
      name: 'User Name',
      selector: (row) => row.User_Name,
      sortable: true,
      center: true,
    },
    {
      name: 'Division',
      selector: (row) => row.Division,
      sortable: true,
      center: true,
    },
    {
      name: 'Department',
      selector: (row) => row.Department,
      sortable: true,
      center: true,
    },
    {
      name: 'Designation',
      selector: (row) => row.Designation,
      sortable: true,
      center: true,
    },
    {
      name: 'Assgined Vehicle Type',
      selector: (row) => row.AssignedVechileType,
      sortable: true,
      center: true,
    },
    {
      name: 'Location',
      selector: (row) => row.Location,
      sortable: true,
      center: true,
    },
    {
      name: 'User ID',
      selector: (row) => row.User_ID,
      sortable: true,
      center: true,
    },
    {
      name: ' User Mobile Number',
      selector: (row) => row.User_Mobile_Number,
      sortable: true,
      center: true,
    },
    {
      name: 'User Mail ID',
      selector: (row) => row.User_Mail_ID,
      sortable: true,
      center: true,
    },
    {
      name: 'User Photo',
      selector: (row) => row.User_Photo,
      center: true,
    },
    {
      name: 'Creation Date',
      selector: (row) => row.Creation_Date,
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
          <CRow className="mt-1 mb-1">
            <CCol
              className="offset-md-6"
              xs={15}
              sm={15}
              md={6}
              style={{ display: 'flex', justifyContent: 'end' }}
            >
              <CButton
                size="md"
                color="warning"
                // disabled={enableSubmit}
                className="px-3 text-white"
                type="submit"
              >
                <Link className="text-white" to="/UserLoginMaster">
                  NEW
                </Link>
              </CButton>
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
                pending={pending}
                showSearchFilter={true}
              />
              <hr></hr>
            </CContainer>
            {/* Model for User Photo  */}
            <CModal visible={userphoto} onClose={() => setUserphoto(false)}>
              <CModalHeader>
                <CModalTitle>User Photo</CModalTitle>
              </CModalHeader>
              <CModalBody>
                <CCardImage orientation="top" src={documentSrc} />
              </CModalBody>
              <CModalFooter>
                <CButton color="secondary" onClick={() => setUserphoto(false)}>
                  Close
                </CButton>
              </CModalFooter>
            </CModal>
            {/* Model for User Photo  */}
          </CCard>
        </>
      )}
    </>
  )
}

export default UserLoginMasterTable
