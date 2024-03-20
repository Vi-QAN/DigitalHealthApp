using WebData;
using WebData.Models;
using FileMode = WebData.Models.FileMode;

namespace HealthSharer
{
    public class Seed
    {
        public static void EnsureFileActions(DigitalHealthContext context)
        {
            if (context.FileActions.Any()) return;

            var fileActions = new List<FileAction>()
            {
                new FileAction(){ Name = "Open"},
                new FileAction(){ Name = "Upload"},
                new FileAction(){ Name = "Download"},
                new FileAction(){ Name = "Remove"}
            };
            context.FileActions.AddRange(fileActions);
            context.SaveChanges();
        }

        public static void EnsureFileModes(DigitalHealthContext context)
        {
            if (context.FileModes.Any()) return;

            var fileModes = new List<FileMode>()
            {
                new FileMode(){ Name = "Public"},
                new FileMode(){ Name = "Private"},
            };

            context.FileModes.AddRange(fileModes);
            context.SaveChanges();
        }

        public static void EnsureAvailableActions(DigitalHealthContext context)
        {
            if (context.AvailableActions.Any()) return;

            var availableActions = new List<AvailableAction>()
            {
                new AvailableAction(){ FileActionId = 1, FileModeId = 1},
                new AvailableAction(){ FileActionId = 2, FileModeId = 1},
                new AvailableAction(){ FileActionId = 3, FileModeId = 1},
                new AvailableAction(){ FileActionId = 4, FileModeId = 1},
                new AvailableAction(){ FileActionId = 1, FileModeId = 2},
                new AvailableAction(){ FileActionId = 2, FileModeId = 2},
                new AvailableAction(){ FileActionId = 4, FileModeId = 2},
            };

            context.AvailableActions.AddRange(availableActions);
            context.SaveChanges();
        }
    }
}
