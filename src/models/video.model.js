import mongoose, {Schema} from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";




const videoSchema = new Schema(
    {
        videoFile:{
            type: String,  //cloudinary URl
            required: true
        },

        thumbnail:{
            type: String,  
            required: true
        },

        owner:[
            {
                type: Schema.Types.ObjectId,
                ref: "User"
            }
        ],

        title:{
            type: String,  
            required: true
        },

        description:{
            type: String,  
            required: true
        },

        duration:{
            type: Number,  
            required: true
        },

        views:{
            type: Number, 
            default: 0
        },

        isPublished:{
            type: Boolean,  
            required: true
        },


    },

    {
        timestamps: true
    }
)


// Aggregation Queries - mongoose
videoSchema.plugin(mongooseAggregatePaginate)



export const Video = mongoose.model("Video", videoSchema)

