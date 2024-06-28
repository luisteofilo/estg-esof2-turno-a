using ESOF.WebApp.DBLayer.Context;
using ESOF.WebApp.WebAPI.DtoClasses;
using Helpers.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ESOF.WebApp.DBLayer.Entities;

namespace ESOF.WebApp.WebAPI.Services
{
    public class RomEmulatorService
    {
        private readonly ApplicationDbContext _context;

        public RomEmulatorService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<List<RomsViewModel>> GetRomsByGameIdAsync(Guid gameId)
        {
            var roms = await _context.Roms
                .Where(r => r.GameId == gameId)
                .Select(r => new RomsViewModel
                {
                    RomId = r.RomId,
                    GameId = r.GameId,
                    ROM = r.ROM,
                    File_name = r.File_name
                })
                .ToListAsync();

            return roms;
        }

        public async Task<RomsViewModel> GetRomByIdAsync(Guid romId)
        {
            var rom = await _context.Roms
                .Where(r => r.RomId == romId)
                .Select(r => new RomsViewModel
                {
                    RomId = r.RomId,
                    GameId = r.GameId,
                    ROM = r.ROM,
                    File_name = r.File_name
                })
                .FirstOrDefaultAsync();

            return rom;
        }

        public async Task AddRomAsync(Roms rom)
        {
            _context.Roms.Add(rom);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateRomAsync(Roms rom)
        {
            _context.Entry(rom).State = EntityState.Modified;
            await _context.SaveChangesAsync();
        }

        public async Task DeleteRomAsync(Guid romId)
        {
            var rom = await _context.Roms.FindAsync(romId);
            if (rom != null)
            {
                _context.Roms.Remove(rom);
                await _context.SaveChangesAsync();
            }
        }
    }
}
