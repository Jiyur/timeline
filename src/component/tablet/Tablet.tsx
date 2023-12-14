import { Button, Divider } from "antd"
import { useCallback, useEffect, useMemo, useState } from "react"
import { format, set } from "date-fns"
import Flex from 'antd/es/flex'
import Title from 'antd/es/typography/Title'
import Paragraph from 'antd/es/typography/Paragraph'
import { DisabledInterval } from "@matiaslgonzalez/react-timeline-range-slider"
import { isSameTime } from "../common/utils"
import Timeline from "../timeline/Timeline"
import './Tablet.css'

type Activity = 'create' | 'use' | 'delete' | 'error'

const now = new Date();
const getTodayAtSpecificHour = (hour = 12) =>
  set(now, { hours: hour, minutes: 0, seconds: 0, milliseconds: 0 })

const selectedStart = getTodayAtSpecificHour(8);
const selectedEnd = getTodayAtSpecificHour(9);

const Tablet = () => {
  const ROOM_ID = "Meeting room 01"
  const [error, setError] = useState<boolean>(false);
  const [activity, setActivity] = useState<Activity>('create')
  const [meetings, setMeetings] = useState<DisabledInterval[]>()
  const [selectedItem, setSelectedItem] = useState<DisabledInterval>()
  const [currentTime, setCurrentTime] =
    useState<[selectedStart: Date, selectedEnd: Date]>([
      selectedStart,
      selectedEnd,
    ])

  const statusColor = useMemo(() => {
    if (activity === 'create') {
      return '#63c302'
    }
    if (activity === 'use') {
      return '#ffc300'
    }
    return '#d5092f'

  }, [activity])

  const handleOnSave = () => {
    if (error || isSameTime(currentTime[0], currentTime[1])) {
      return
    }
    const newMeetings = Array.from(meetings || []);
    newMeetings.push({
      id: ("Meeting " + newMeetings.length).toString(),
      start: currentTime[0],
      end: currentTime[1],
      color: 'yellow'
    })
    setMeetings(newMeetings)
  }

  const onTimeSelect = useCallback(() => {
    const selected = meetings?.find((meeting: DisabledInterval) => {
      if (isSameTime(meeting.start, currentTime[0]) && isSameTime(meeting.end, currentTime[1])) {
        setSelectedItem(meeting)
        return meeting
      }

    })
    if (selected && selected.color === 'yellow') {
      setActivity('use')
      return;

    }
    if (!selected && !error) {
      setActivity('create')
      setSelectedItem(undefined)
    }
    else {
      setActivity('error')
      setSelectedItem(undefined)
    }
  }, [currentTime, meetings, error])

  useEffect(() => {
    onTimeSelect()
  }, [currentTime, onTimeSelect])

  return (
    <div style={{ marginLeft: '1rem', marginRight: '1rem' }}>
      <Flex justify='start' className='header-text'>
        <Title level={4} style={{ color: 'white' }}>{ROOM_ID} </Title>
      </Flex>
      <Divider style={{ color: 'white', background: 'white' }} />
      <Flex align='center' style={{ marginBottom: 40 }} gap={60}>
        <Flex align='center' justify='center'
          style={{
            flexGrow: 1,
            color: statusColor === '#ffc300' ? 'black' : 'white', padding: '70px 40px', background: statusColor,
            fontSize: '22px'
          }}>
          {activity.toLocaleUpperCase()}
        </Flex>
        <div style={{ flexGrow: 1 }}>
          <Paragraph style={{ fontSize: 16, color: 'white', textTransform: 'uppercase' }} >{selectedItem?.id ?? 'No meeting available'}</Paragraph>
          <Paragraph style={{ fontSize: 16, fontWeight: 'bold', color: 'white' }}>
            {format(currentTime[0], 'H:mm')}-{format(currentTime[1], 'H:mm')}
          </Paragraph>
          <Paragraph style={{ color: 'white', fontSize: 14 }}>Host: HR&GA</Paragraph>
          <Paragraph style={{ fontSize: 16, fontWeight: 'bolder', color: 'white' }}>
          </Paragraph>
          <Button
            type="primary"
            size="large"
            onClick={handleOnSave}>
            {activity.toUpperCase()}
          </Button>
        </div>

      </Flex >
      <Divider style={{ color: 'white', background: 'white' }} />
      <div>
        <Timeline
          setCurrentTime={setCurrentTime}
          meetings={meetings}
          error={error}
          setError={setError}
          currentTime={currentTime}
        />
      </div>
    </div>
  )
}

export default Tablet