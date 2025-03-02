import { Box } from '@chakra-ui/react'
import React from 'react'
import { SmallCloseIcon } from '@chakra-ui/icons'

const UserBadgeItem = ({user , handleFunction}) => {
  return (
    <Box px={2} py={1} borderRadius={"lg"} m={1} mb={2} variant="solid" fontSize={15} bg={'blue.500'} color={'whiteAlpha.900'}  cursor={"pointer"} onClick={handleFunction}> {user.name} <SmallCloseIcon pl={1} boxSize={6}/>

    </Box>
  )
}

export default UserBadgeItem
