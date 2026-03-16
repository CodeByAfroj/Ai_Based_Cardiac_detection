function Recommendation({risk}){

  let advice = "Healthy rhythm"

  if(risk==="Medium")
    advice="Monitor heart and avoid stress"

  if(risk==="High")
    advice="Consult doctor immediately"

  return(

    <div className="bg-white p-6 rounded shadow">

      <h2 className="text-xl font-bold mb-4">
        Recommendation
      </h2>

      <p>
        {advice}
      </p>

    </div>

  )
}

export default Recommendation