export const getSender = (loggedUser , users)=>{
    return users[0]._id === loggedUser._id ? users[1].name : users[0].name;

};
export const getSenderFull = (loggedUser , users)=>{
    return users[0]._id === loggedUser._id ? users[1] : users[0];

};

// export const isSameSender = (messages ,m,i,userId)=>{
//     return (
//         i<messages.length-1 && (messages[i+1].sender._id!== m.sender._id || messages[i+1].sender._id === undefined) && messages[i].sender._id !== userId
//     );
// };

// export const isLastMessage = (messages,i,userId)=>{
//     return (
//         i=== messages.length-1 && messages[messages.length -1].sender._id !==userId && messages[messages.length-1].sender._id
//     );
// };

export const isSameSender = (messages, m, i, userId) => {
    if (!messages || !messages[i] || !messages[i].sender) return false; // Prevent crashes
  
    return (
      i < messages.length - 1 &&
      messages[i + 1]?.sender?._id !== m?.sender?._id && 
      messages[i + 1]?.sender?._id !== undefined &&
      messages[i]?.sender?._id !== userId
    );
  };
  
  export const isLastMessage = (messages, i, userId) => {
    if (!messages || messages.length === 0) return false; // Safety check
  
    const lastMessage = messages[messages.length - 1];
    return (
      i === messages.length - 1 &&
      lastMessage?.sender?._id !== userId &&
      lastMessage?.sender?._id !== undefined
    );
  };


  export const isSameSenderMargin = (messages,m,i,userId) =>{
    console.log(`Checking Margin for Message ${i}:`, {
      senderID: m.sender?._id,
      nextSenderID: messages[i + 1]?.sender?._id,
      userID: userId
    });
    if(i< messages.length-1 && messages[i+1].sender?._id === m.sender?._id && messages[i].sender?._id !== userId){
      return 33;
    }
    else if(
      (i<messages.length-1 && messages[i+1].sender?._id !== m.sender?._id && messages[i].sender?._id !== userId) || (i=== messages.length-1 && messages[i].sender?._id !== userId)
    ){
      return 0;
    }
    else{
      return "auto";
    }
  }
  // export const isSameSenderMargin = (messages, m, i, userId) => {
  //   if (
  //     i < messages.length - 1 &&
  //     String(messages[i + 1]?.sender?._id) === String(m.sender?._id) &&
  //     String(messages[i]?.sender?._id) !== String(userId)
  //   ) {
  //     return 33;
  //   } else if (
  //     (i < messages.length - 1 &&
  //       String(messages[i + 1]?.sender?._id) !== String(m.sender?._id) &&
  //       String(messages[i]?.sender?._id) !== String(userId)) ||
  //     (i === messages.length - 1 && String(messages[i]?.sender?._id) !== String(userId))
  //   ) {
  //     return 0;
  //   } else {
  //     return "0px";
  //   }
  // };
  

export const isSameUser = (messages,m,i)=>{
  return i>0 && messages[i-1].sender?._id === m.sender._id;
}

