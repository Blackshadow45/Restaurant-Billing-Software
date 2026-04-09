import { useParams } from "react-router-dom";

export default function Order() {
  const { orderId } = useParams();
  
  const printBill=()=>{
    window.print();
  }
  return (
    <div style={{ padding: "20px" }}>
      <h2>Order ID</h2>
      <p>{orderId}</p>

      <p>Menu & cart will come here next</p>
    </div>
  );
}
