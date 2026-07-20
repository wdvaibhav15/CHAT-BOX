import Connection from "../models/connection.js";
import { Inngest } from "inngest";
import User from "../models/user.js";
import sendEmail from "../configs/nodeMailer.js";
import Story from "../models/story.js";

export const inngest = new Inngest({ id: "Chat-Box-app" });

const syncUserCreation = inngest.createFunction(
  {
    id: "sync-user-from-clerk",
    triggers: [{ event: "clerk/user.created" }],
  },
  async ({ event }) => {
    const { id, first_name, last_name, email_addresses, image_url } = event.data;

    let username = email_addresses[0].email_address.split("@")[0];

    const existingUser = await User.findOne({ username });

    if (existingUser) {
      username = username + Math.floor(Math.random() * 10000);
    }

    await User.create({
      _id: id,
      email: email_addresses[0].email_address,
      full_name: `${first_name} ${last_name}`,
      profile_picture: image_url,
      username,
    });
  }
);

const syncUserUpdation = inngest.createFunction(
  {
    id: "update-user-from-clerk",
    triggers: [{ event: "clerk/user.updated" }],
  },
  async ({ event }) => {
    const { id, first_name, last_name, email_addresses, image_url } = event.data;

    await User.findByIdAndUpdate(id, {
      email: email_addresses[0].email_address,
      full_name: `${first_name} ${last_name}`,
      profile_picture: image_url,
    });
  }
);

const syncUserDeletion = inngest.createFunction(
  {
    id: "delete-user-with-clerk",
    triggers: [{ event: "clerk/user.deleted" }],
  },
  async ({ event }) => {
    await User.findByIdAndDelete(event.data.id);
  }
);

// Inngest Function to send Reminder when a new connection request is added
// const sendNewConnectionRequestReminder = inngest.createFunction(
//     { id: "send-new-connection-request-reminder" },
//     { event: "app/connection-request" },
//     async ({ event, step }) => {
//         const { connectionId } = event.data;

//         await step.run('send-connection-request-mail', async () => {
//             const connection = await Connection.findById(connectionId).populate('form_user_id to_user_id');
//             const subject = `👋 New Connection Request`;
//             const body = `
//                 <div style="font-family: Arial sans-serif; padding: 20px;">
//                     <h2>Hello ${connection.to_user_id.full_name},</h2>
//                     <p>You have received a new connection request from <strong>${connection.form_user_id.full_name}</strong> -(@${connection.form_user_id.username}).</p>
//                     <p>click <a href="${process.env.CLIENT_URL}/connections" style="color:#10b981;"> here</a> to accept or reject the request</p>
//                     <br/>
//                     <p>Thanks,<br/>Chat-Box</p>
//                     </div>
//             `;
//         })
//     }
// )
const sendNewConnectionRequestReminder = inngest.createFunction(
    { 
      id: "send-new-connection-request-reminder",
      triggers: [{ event: "app/connection-request" }] 
    },
    async ({ event, step }) => {
        const { connectionId } = event.data;

        await step.run('send-connection-request-mail', async () => {
            const connection = await Connection.findById(connectionId).populate('form_user_id to_user_id');
            
            if (!connection) return; // Prevent crashes if connection document isn't ready yet

            const subject = `👋 New Connection Request`;
            const body = `
                <div style="font-family: Arial, sans-serif; padding: 20px;">
                    <h2>Hello ${connection.to_user_id.full_name},</h2>
                    <p>You have received a new connection request from <strong>${connection.form_user_id.full_name}</strong> (@${connection.form_user_id.username}).</p>
                    <p>Click <a href="${process.env.FRONTEND_URL}/connections" style="color:#10b981;">here</a> to accept or reject the request.</p>
                    <br/>
                    <p>Thanks,<br/>Chat-Box</p>
                </div>`;
                await sendEmail({
                  to:connection.to_user_id.email,
                  subject,
                  body 
                })
        })
        const in24Hours =  new Date(Date.now() + 24 * 60 * 60 * 1000);
        await step.sleepUntil("wait-for-24-hours", in24Hours);
        await step.run("send-new-connection-request-reminder", async() => {
          const connection = await Connection.findById(connectionId).populate('form_user_id to_user_id');
          if(connection.status === "accepted"){
            return {message: "Connection already accepted"}
          }
          const subject = `👋 New Connection Request`;
            const body = `
                <div style="font-family: Arial, sans-serif; padding: 20px;">
                    <h2>Hello ${connection.to_user_id.full_name},</h2>
                    <p>You have received a new connection request from <strong>${connection.form_user_id.full_name}</strong> (@${connection.form_user_id.username}).</p>
                    <p>Click <a href="${process.env.FRONTEND_URL}/connections" style="color:#10b981;">here</a> to accept or reject the request.</p>
                    <br/>
                    <p>Thanks,<br/>Chat-Box</p>
                </div>`;
                await sendEmail({
                  to:connection.to_user_id.email,
                  subject,
                  body 
                })
                return {message: "Connection request sent again"}
        });
    }
);

// inngest duntion to delete story after 24 hours
const deleteStory = inngest.createFunction(
    { 
      id: "story-delete" ,
      event: "app/story-delete" },
    async ({ event, step }) => {
      const { storyId } = event.data;
      const in24Hours = new Date(Date.now() + 24 * 60 * 60 * 1000);
      await step.sleepUntil("wait-for-24-hours", in24Hours);
      await step.run("delete-story", async () => {
        await Story.findByIdAndDelete(storyId);
        return { message: "Story deleted" };
      });
    }
  )


// Create an enpty array where we will export future inngest functions
export const functions = [
  syncUserCreation,
  syncUserUpdation,
  syncUserDeletion,
  sendNewConnectionRequestReminder,
  deleteStory 

];