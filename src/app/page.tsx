'use client'

import { Button, Flex, Modal, Select } from "antd"
import { useState } from "react"
import Tablet from "@/component/tablet/Tablet"
import Timeline from "@/component/timeline/Timeline"

type RoomPulldown = {
  label: React.ReactNode,
  value: string,
}

const roomList: RoomPulldown[] = [{
  label: 'Meeting R01',
  value: 'MeetingRoom01'
}, {
  label: 'Meeting R02',
  value: 'MeetingRoom02'
}]

export default function Home() {
  const [roomId, setRoomId] = useState<String>(roomList[0].value)

  const handleChange = (value: {
    value: string; label: React.ReactNode
  }) => {
    setRoomId(value.value)
  }

  return (
    <main >
      <div style={{ height: '100px !important', display: 'flex', justifyContent: 'center', alignItems: 'center' }} >
        <Select
          defaultValue={roomList[0]}
          labelInValue
          style={{ width: 200 }}
          onChange={handleChange}
          options={roomList}
        />
      </div>
      <Tablet roomId={roomId} />

    </main>
  )
}
