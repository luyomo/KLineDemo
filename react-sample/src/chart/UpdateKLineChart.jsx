import React, { useEffect } from 'react'
import { init, dispose } from 'klinecharts'
import generatedKLineDataList from '../utils/generatedKLineDataList'
import Layout from '../Layout'

export default function UpdateKLineChart () {
  function updateData (kLineChart) {
    if (kLineChart) {
      var ws = new WebSocket('wss://www.51yomo.net/tickData')
      ws.onopen = function () {
        // console.log('About to send data at onmessage')
        ws.send('Hello World')
        // console.log('Message sent! at onmessage')
      }

      ws.onmessage = function (evt) {
        // console.log('About to receive data at onmessage')
        var receivedMsg = JSON.parse(evt.data)
        // console.log('Message received = ' + typeof (receivedMsg) + ' at onmessage')
        // console.log(receivedMsg)
        for (const val of receivedMsg) {
          // console.log('The data is ' + val)
          kLineChart.updateData(val)
        }
      }

      ws.onclose = function (event) {
        if (event.wasClean) {
          console.log(`[close] Connection closed cleanly, code=${event.code} reason=${event.reason}`)
        } else {
          console.log('[close] Connection died')
        }
      }

      ws.onerror = function (error) {
        alert(`[error] ${error.message}`)
      }
    }
  }

  useEffect(() => {
    const kLineChart = init('update-k-line')
    kLineChart.applyNewData(generatedKLineDataList())
    updateData(kLineChart)
    return () => {
      dispose('update-k-line')
    }
  }, [])
  return (
    <Layout
      title="实时更新">
      <div id="update-k-line" className="k-line-chart"/>
    </Layout>
  )
}
