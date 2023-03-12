import protobuf from 'protobufjs'

export const getPackageAndMessage = (protoFileContent: string): { packageName: string; messageName: string } => {
  // Determine package and message name
  const lines = protoFileContent.split('\n')
  const packageName = lines
    .find((l) => l.startsWith('package'))
    ?.split(' ')?.[1]
    ?.replace(';', '')

  const messageName = lines
    .map((l) => l.trim())
    .find((l) => l.includes('message'))
    ?.split(' ')?.[1]
    ?.replace(';', '')
  if (!messageName) throw new Error('cannot find message')

  return { packageName: packageName ?? '', messageName }
}

export const resolveRootNamespace = (protoFileContent: string): protobuf.Root => {
  // Load proto file content straight form a variable, as opposed to loading it from a file - https://github.com/protobufjs/protobuf.js/issues/1871#issuecomment-1464770967
  const root = new protobuf.Root()
  protobuf.parse(protoFileContent, root, { keepCase: true, alternateCommentMode: false, preferTrailingComment: false })
  root.resolveAll()

  return root
}

export const lookupMessageType = (root: protobuf.Root, messageName: string, packageName?: string): protobuf.Type => {
  const msgType = root.lookupType(packageName ? `${packageName}.${messageName}` : messageName)
  return msgType
}

export const getProtobufMessageType = (protoFileContent: string): protobuf.Type => {
  // Determine package and message name
  const { packageName, messageName } = getPackageAndMessage(protoFileContent)
  console.log('Package name: ' + packageName)
  if (!messageName) throw new Error('cannot find message')
  console.log('Message name: ' + messageName)

  const root = resolveRootNamespace(protoFileContent)

  const msgType = lookupMessageType(root, messageName, packageName)

  return msgType
}
