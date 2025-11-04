import {Client, Databases, Query, ID} from 'appwrite'

const dbId  = import.meta.env.VITE_APPWRITE_DATABASE
const prjId  = import.meta.env.VITE_APPWRITE_PROJECT_ID
const collId  = import.meta.env.VITE_APPWRITE_COLLECTION

const client = new Client()
    .setEndpoint("https://cloud.appwrite.io/v1")
    .setProject(prjId)
const database = new Databases(client)
export const UpdateSearch = async (searchTerm,movie)=>{
     try{
        const result = await database.listDocuments(dbId,collId,[
            Query.equal('searchTerm',searchTerm ),
        ])
        if(result.documents.length>0){
            const doc = result.documents[0]
            await database.updateDocument(dbId,collId,doc.$id, {
                count : doc.count +1
            })
        }
        else{
            await database.createDocument(dbId,collId,ID.unique(), {
                searchTerm,
                count: 1,
                movie_id : movie.id,
                poster_url : `https://image.tmdb.org/t/p/w500${movie.poster_path}`
            })
        }
     }
     catch (err) {
        console.error("Appwrite error:", err);
      }
      
}
export const trendingMovies = async ()=>{
    try{
        const result = await database.listDocuments(dbId,collId,[
            Query.limit(5),
            Query.orderDesc("count")
        ])
        return result.documents
    } catch(err){
        console.log(err)
    }
}