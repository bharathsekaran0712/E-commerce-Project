import { Star } from 'lucide-react'
import React from 'react'
import Order from '../Pages/Order'

const  Rating = (props) => {
  console.log(props.item,"item")
  console.log(props.rating,"rating")
  return (
    <div className='flex'>
        <Star className={`${props.rating >= 1 ? "text-amber-300 fill-amber-300": ""}`} onClick={()=>{if(!props.viewOnly) {props.setRating(1);
        props.setProductId(props.item);
        props.setOrderId(props.orderId)
        }
        }}/>
        <Star className={`${props.rating >= 2 ? "text-amber-300 fill-amber-300": ""}`} onClick={()=>{if(!props.viewOnly) {props.setRating(2);
          props.setProductId(props.item);
          props.setOrderId(props.orderId)
          }
        }}/>
        <Star className={`${props.rating >= 3 ? "text-amber-300 fill-amber-300": ""}`} onClick={()=>{if(!props.viewOnly) {props.setRating(3);
          props.setProductId(props.item);
          props.setOrderId(props.orderId)
        }
        }}/>
        <Star className={`${props.rating >= 4 ? "text-amber-300 fill-amber-300": ""}`} onClick={()=>{if(!props.viewOnly) {props.setRating(4);
          props.setProductId(props.item);
          props.setOrderId(props.orderId)
        }
        }}/>
        <Star className={`${props.rating >= 5 ? "text-amber-300 fill-amber-300": ""}`} onClick={()=>{if(!props.viewOnly) {props.setRating(5);
          props.setProductId(props.item);
          props.setOrderId(props.orderId)
        }
        }}/>
    </div>
  )

}
export default Rating