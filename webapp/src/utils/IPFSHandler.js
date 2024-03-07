import { extract } from 'it-tar'
import { pipe } from 'it-pipe'
import toBuffer from 'it-to-buffer'
import Pako from 'pako'
import all from 'it-all'
import map from 'it-map'

// Add file to IPFS and return a CID
export const saveToIpfs = async ([file], ipfs) => {
    try {
        const added = await ipfs.add(
            file,
            {
            progress: (prog) => console.log(`received: ${prog}`)
            }
        )
        return { ...added, file: file}
    } catch (err) {
        throw new Error("IPFS failed to add file", err);
    }
}

export const downloadFromIPFS = async(ipfs, item) => {
    const output = await pipe(
        ipfs.get(item.fileHash),
        tarballed,
        (source) => all(source)
      )

    const paths = output.map((file) => { return file.header.name })
    // setContent(output[0].body)
    const blob = new Blob([output[0].body], {type: item.fileType})
    const fileURL = URL.createObjectURL(blob);
    return fileURL;
}

// Add file to IPFS and wrap it in a directory to keep the original filename
export const saveToIpfsWithFilename = async ([file], ipfs) => {
    const fileDetails = {
        path: file.name,
        content: file
    }

    const options = {
        wrapWithDirectory: true,
        progress: (prog) => console.log(`received: ${prog}`)
    }

    try {
        const added = await ipfs.add(fileDetails, options)
        return { ...added, file: file}
        //setFileHashes((list) => [...list, added.cid.toString()])
    } catch (err) {
      console.log("IPFS failed to add file", err);
    }
}

async function * gzipped (source) {
    const inflator = new Pako.Inflate()

    for await (const buf of source) {
      inflator.push(buf, false)
    }

    inflator.push(new Uint8Array(0), true)

    if (inflator.err) {
      throw new Error(`Error ungzipping - message: "${inflator.msg}" code: ${inflator.err}`)
    }

    if (inflator.result instanceof Uint8Array) {
      yield inflator.result
    } else {
      throw new Error('Unexpected gzip data type')
    }
  }

  /**
   * @param {Source} source
   */
   async function * tarballed (source) {
    yield * pipe(
      source,
      extract(),
      async function * (source) {
        for await (const entry of source) {
          yield {
            ...entry,
            body: await toBuffer(map(entry.body, (buf) => buf.slice()))
          }
        }
      }
    )
  }