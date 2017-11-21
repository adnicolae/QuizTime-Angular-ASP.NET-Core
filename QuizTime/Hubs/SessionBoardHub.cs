using Microsoft.AspNetCore.SignalR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace QuizTime.Hubs
{
    public class SessionBoardHub : Hub
    {
        public Task Send(string username)
        {
            return Clients.All.InvokeAsync("Send", username);
        }

        public Task Update(int status)
        {
            return Clients.All.InvokeAsync("Update", status);
        }
    }
}
