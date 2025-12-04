import React, { useState } from 'react'
import { Button } from '@mui/material'
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';



const DashboardBox = (props) => {

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const ITEM_HEIGHT = 48;

  return (
    <Button className='dashboardBox' style={{background:`${props.color}`}}>

        {
            props.grow === true ?
            <span className='chart'><TrendingUpIcon/></span>
            :
            <span  className='chart'><TrendingDownIcon/></span>
        }

        <div className='d-flex w-100'>
            <div className='col1'>
                <h4 className=' mb-0'>{props.name}</h4>
                <span style={{color: "#403e57"}} >{props.length}</span>
            </div>

            <div className='ms-auto'>
                {
                    props.icon ?
                    <span className='icon' style={{background: `${props.bgColor}`}}>
                        {props.icon}
                    </span>
                    :
                    ''
                }
            </div>
        </div> 

        
        
          
    </Button>
  )
}

export default DashboardBox
