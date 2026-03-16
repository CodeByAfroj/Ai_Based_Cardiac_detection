function MetricCard({title,value,color}){

  return(

    <div className="bg-white rounded-xl shadow p-6">

      <h3 className="text-gray-500">
        {title}
      </h3>

      <p className={`text-2xl font-bold ${color}`}>
        {value}
      </p>

    </div>

  )
}

export default MetricCard