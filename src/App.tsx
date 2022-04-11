import React, { useState, useEffect } from 'react'
import { message, Table, Select } from 'antd'
import axios from 'axios'

const { Option } = Select;

interface item {
  from: string,
  to: string,
  status: string,
  updatedAt: string,
  createdAt: string,
  max: number,
  min: number,
  minConf: number,
  rate: number
}

type itemArray = item[]

const columns = [
  {
    title: 'CURRENCY PAIR',
    render: (text: any, record: item) => {
      return (
        <span>
          {`${record.from}/${record.to}`}
        </span>
      )
    }
  },
  {
    title: 'RATE',
    dataIndex: 'rate'
  },
]

const App = () => {
  const [data, setData] = useState<itemArray>([])
  const [loading, setLoading] = useState(false)
  const [updatesAt, setUpdatesAt] = useState(null)

  /**
   * Get items 
   */
  const getItems = async () => {
    setLoading(true)
    try {
      const res = await axios.get(`https://liquality.io/swap/agent/api/swap/marketinfo`)
      setLoading(false)
      setData(res.data)
    } catch (error) {
      setLoading(false)
      setData([])
      message.error('Could not get data')
    }
  }


  useEffect(() => {
    getItems()
  }, [])

  useEffect(() => {
    let mounted = true
    if (updatesAt) {
      const rateInterval = setInterval(async () => {
        if (mounted) {
          await getItems()
        }
      }, updatesAt * 1000)
      return () => {
        mounted = false
        clearInterval(rateInterval)
      }
    }
  }, [updatesAt,])


  return (
    <div className='main'>
      <div className="content-holder">
        <h1 className="title">
          Liquality Challenge
        </h1>

        <div className="update-holder">
          <p className="label">Updates at</p>
          <Select
            allowClear
            placeholder='Select option'
            onChange={(value) => {
              if (value === undefined) {
                setUpdatesAt(null)
              } else {
                setUpdatesAt(value)
              }
            }}
          >
            <Option value={5}>5s</Option>
            <Option value={10}>10s</Option>
            <Option value={15}>15s</Option>
          </Select>
        </div>

        <Table
          loading={loading}
          columns={columns}
          dataSource={data}
          rowKey={(item: item) => item.createdAt}
        />
      </div>
    </div>
  )
}

export default App